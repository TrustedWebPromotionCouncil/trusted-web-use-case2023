package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
	"github.com/gin-gonic/gin"
)

func (p *HandlerProvider) handlerMatchingSystemPlanXPostNewCandidate(c *gin.Context) {
	usecase := func() (int64, domain.EncryptKey, bool, error) {
		enckey, exists, err := p.d.DomainProvider.GetServices().EncryptKeyService.Get()
		if err != nil {
			return 0, enckey, exists, err
		}
		if !exists {
			logger.Errorf("encryot_keys does not exists")
			return 0, enckey, exists, err
		}

		if err != nil {
			return 0, enckey, false, err
		}

		// 新規ユーザ作成
		id, err := p.d.DomainProvider.GetServices().CandidateService.Create()
		return id, enckey, true, err
	}
	id, enckey, exists, err := usecase()

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	if !exists {
		logger.Errorf("enckey does not exists")
		c.JSON(http.StatusNotFound, gin.H{})
		return
	}

	c.JSON(http.StatusOK, apiio.ResponseMatchingSystemPlanXGetPublickey{
		UserId:        id,
		CkksPublickey: enckey.Ckks.Publickey,
		RsaPublickey:  enckey.Rsa.Publickey,
	})
}
