package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (p *HandlerProvider) handlerMatchingSystemGetSecretKeyForDebug(c *gin.Context) {
	user := c.MustGet(gin.AuthUserKey).(string)
	logger.Infof(user)

	enckey, exists, err := p.d.DomainProvider.GetServices().EncryptKeyService.Get()
	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{})
		return
	}

	type response struct {
		CkksSecretkey string `json:"ckks_secretkey" binding:"required"`
		RsaPrivatekey string `json:"rsa_privatekey" binding:"required"`
	}

	c.JSON(http.StatusOK, response{
		CkksSecretkey: enckey.Ckks.Secretkey,
		RsaPrivatekey: enckey.Rsa.Privatekey,
	})
}
