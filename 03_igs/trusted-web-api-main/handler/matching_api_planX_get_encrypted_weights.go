package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/gin-gonic/gin"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

func (p *HandlerProvider) handlerMatchingSystemPlanXGetEncryptedWeights(c *gin.Context) {
	var b64s string
	var enckey domain.EncryptKey

	usecase := func() (exists bool, err error) {
		enckey, exists, err = p.d.DomainProvider.GetServices().EncryptKeyService.Get()
		if err != nil {
			return
		}
		if !exists {
			logger.Errorf("encryot_keys does not exists")
			return
		}

		pk, err := ckks.FromBase64String[rlwe.PublicKey](enckey.Ckks.Publickey)
		if err != nil {
			return
		}
		enc, err := ckks.NewCalculatorUsingPublickey(pk)
		if err != nil {
			return
		}

		w, exists, err := p.d.DomainProvider.GetServices().VectorWeightService.Get()
		if err != nil {
			return
		}
		if !exists {
			logger.Errorf("vector_weights does not exists")
			return
		}
		logger.Infof("fetch weight: %+v", w)

		encWeight := w.EncryptRLWE(enc)
		b64s, err = ckks.ToBase64String(encWeight)
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

	c.JSON(http.StatusOK, apiio.ResponseMatchingSystemPlanXGetEncryptedWeights{
		Payload:   b64s,
		Publickey: enckey.Ckks.Publickey,
		Rotatekey: enckey.Ckks.Rotatekey,
		Relinkey:  enckey.Ckks.Relinkey,
	})
}
