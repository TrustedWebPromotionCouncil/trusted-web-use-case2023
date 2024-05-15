package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/gin-gonic/gin"
)

func (p *HandlerProvider) handlerMatchingSystemPlanYPostPublicKey(c *gin.Context) {
	var req apiio.RequestMatchingSystemPlanYPostPublickey
	if err := c.ShouldBind(&req); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logger.Infof("parse request : %#v", req)

	resp := apiio.ResponseMatchingSystemPlanXGetPublickey{}

	usecase := func() (exists bool, err error) {
		srv := p.d.DomainProvider.GetServices()
		enckey, exists, err := srv.EncryptKeyService.Get()
		if err != nil {
			return
		}
		if !exists {
			logger.Errorf("EncryptKey does not exists")
			return
		}

		// 新規ユーザ作成
		resp.UserId, err = srv.CandidateService.Create()
		if err != nil {
			return
		}
		exists, err = srv.CandidateService.UpdateEncryptKey(resp.UserId, domain.CandidateEncryptKey{
			CkksPublickey: req.CkksPublickey,
		})

		resp.CkksPublickey = enckey.Ckks.Publickey
		resp.RsaPublickey = enckey.Rsa.Publickey

		return
	}
	exists, err := usecase()

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{})
	}

	c.JSON(http.StatusOK, resp)
}
