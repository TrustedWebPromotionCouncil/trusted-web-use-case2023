package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/gin-gonic/gin"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

func (p *HandlerProvider) handlerMatchingSystemPlanYGetEncryptedWeights(c *gin.Context) {
	var req apiio.RequestMatchingSystemPlanYGetEncryptedWeights
	if err := c.ShouldBindUri(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logger.Infof("parse request : %#v", req)

	resp := apiio.ResponseMatchingSystemPlanYGetEncryptedWeights{}

	usecase := func() (exists bool, err error) {
		srv := p.d.DomainProvider.GetServices()
		// ユーザの暗号化キー
		u, exists, err := srv.CandidateService.GetEncryptKey(req.UserID)
		if err != nil {
			return
		}
		if !exists {
			logger.Errorf("CandidateEncryptKey does not exists")
			return
		}

		// 重みベクトル
		w, exists, err := srv.VectorWeightService.Get()
		if err != nil {
			return
		}
		if !exists {
			logger.Errorf("VectorWeight does not exists")
			return
		}

		// 重みベクトル暗号化
		pk, err := ckks.FromBase64String[rlwe.PublicKey](u.CkksPublickey)
		if err != nil {
			return
		}
		enc, err := ckks.NewCalculatorUsingPublickey(pk)
		if err != nil {
			return
		}

		ctW := w.EncryptRLWE(enc)
		resp.Payload, err = ckks.ToBase64String(ctW)

		return true, err
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

	c.JSON(http.StatusOK, resp)
}
