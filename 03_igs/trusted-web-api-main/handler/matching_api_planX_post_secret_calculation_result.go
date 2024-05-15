package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/gin-gonic/gin"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

func (p *HandlerProvider) handlerMatchingSystemPlanXPostSecretCalculationResult(c *gin.Context) {
	var req apiio.RequestMatchingSystemPlanXPostSecretCalculationResult
	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logger.Infof("parse request : %#v", req.UserId)

	usecase := func() (bool, error) {
		// 復号化
		srv := p.d.DomainProvider.GetServices().EncryptKeyService
		keys, exists, err := srv.Get()
		if err != nil {
			return exists, err
		}
		if !exists {
			logger.Errorf("record does not exists")
			return exists, err
		}

		rk, err := srv.ConvertToRaw(&keys)
		if err != nil {
			return false, err
		}
		dec, err := ckks.NewCalculatorUsingSecretkey(rk.Ckks.Secretkey)
		if err != nil {
			return false, err
		}

		ct, err := ckks.FromBase64String[rlwe.Ciphertext](req.Vector)
		if err != nil {
			return false, err
		}

		var v domain.CandidateVector
		v.DecyptRLWE(ct, dec)
		logger.Info(v)

		ctResult, err := ckks.FromBase64String[rlwe.Ciphertext](req.Result)
		if err != nil {
			return false, err
		}
		vResult := dec.Decrypt(ctResult)

		result := domain.CandidateVectorCalcResult{
			Knowledge:  float64(real(vResult[0])),
			Experience: float64(real(vResult[1])),
			Cognition:  float64(real(vResult[2])),
			Community:  float64(real(vResult[3])),
			Attitude:   float64(real(vResult[4])),
		}

		// 保存
		_, err = p.d.DomainProvider.GetServices().CandidateService.UpdateVector(req.UserId, v)
		if err != nil {
			return false, err
		}
		return p.d.DomainProvider.GetServices().CandidateService.UpdateVectorCalcResult(req.UserId, result)
	}
	exists, err := usecase()

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
