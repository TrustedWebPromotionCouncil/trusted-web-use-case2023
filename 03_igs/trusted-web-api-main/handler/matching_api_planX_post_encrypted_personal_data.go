package handler

import (
	"encoding/base64"
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/gin-gonic/gin"
)

func (p *HandlerProvider) handlerMatchingSystemPlanXPostEncryptedProfileData(c *gin.Context) {
	var req apiio.RequestMatchingSystemPlanXPostEncryptedProfileData
	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logger.Infof("parse request : %#v", req)

	usecase := func() (bool, error) {
		// 復号化
		srv := p.d.DomainProvider.GetServices().EncryptKeyService
		keys, exists, err := srv.Get()
		if err != nil {
			return exists, err
		}
		if !exists {
			logger.Errorf("enckey does not exists")
			return exists, err
		}

		rk, err := srv.ConvertToRaw(&keys)
		if err != nil {
			return false, err
		}

		var v domain.CandidateProfile
		b, err := base64.StdEncoding.DecodeString(req.Payload)
		if err != nil {
			return false, err
		}

		v.DecryptRSA(b, rk.Rsa.Privatekey)
		logger.Info(v)

		// 保存
		return p.d.DomainProvider.GetServices().CandidateService.UpdateProfile(req.UserId, v)
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
