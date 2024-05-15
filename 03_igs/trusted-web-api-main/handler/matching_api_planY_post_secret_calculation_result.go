package handler

import (
	"encoding/base64"
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/gin-gonic/gin"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

func (p *HandlerProvider) handlerMatchingSystemPlanYPostSecretCalculationResult(c *gin.Context) {
	var req apiio.RequestMatchingSystemPlanYPostSecretCalculationResult
	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logger.Infof("parse request : %#v", req.UserId)

	usecase := func() (bool, error) {
		// 復号化
		keys, exists, err := p.d.DomainProvider.GetServices().EncryptKeyService.Get()
		if err != nil {
			return exists, err
		}
		if !exists {
			logger.Errorf("EncryptKey does not exists")
			return exists, err
		}

		rk, err := p.d.DomainProvider.GetServices().EncryptKeyService.ConvertToRaw(&keys)
		if err != nil {
			return false, err
		}

		{ // 計算結果保存
			dec, err := ckks.NewCalculatorUsingSecretkey(rk.Ckks.Secretkey)
			if err != nil {
				return false, err
			}

			{ // ベクトルデータ保存
				ct, err := ckks.FromBase64String[rlwe.Ciphertext](req.Vector)
				if err != nil {
					return false, err
				}

				var ins domain.CandidateVector
				ins.DecyptRLWE(ct, dec)
				logger.Info(ins)

				exists, err = p.d.DomainProvider.GetServices().CandidateService.UpdateVector(req.UserId, ins)
				if err != nil {
					return false, err
				}
				if !exists {
					logger.Errorf("CandidateVector does not exists")
					return exists, err
				}
			}

			{ // ベクトル計算結果保存
				ct, err := ckks.FromBase64String[rlwe.Ciphertext](req.Result)
				if err != nil {
					return false, err
				}
				var ins domain.CandidateVectorCalcResult
				ins.DecyptRLWE(ct, dec)
				logger.Info(ins)

				exists, err = p.d.DomainProvider.GetServices().CandidateService.UpdateVectorCalcResult(req.UserId, ins)
				if err != nil {
					return exists, err
				}
				if !exists {
					logger.Errorf("Candidate does not exists")
					return exists, err
				}
			}
		}

		{ // プロファイル保存
			bs, err := base64.StdEncoding.DecodeString(req.Profile)
			if err != nil {
				return false, err
			}

			var ins domain.CandidateProfile
			ins.DecryptRSA(bs, rk.Rsa.Privatekey)
			logger.Info(ins)

			exists, err = p.d.DomainProvider.GetServices().CandidateService.UpdateProfile(req.UserId, ins)
			if err != nil {
				return exists, err
			}
			if !exists {
				logger.Errorf("Candidate does not exists")
				return exists, err
			}
		}

		return true, nil
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
