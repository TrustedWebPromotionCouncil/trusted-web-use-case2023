package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/external"
	"github.com/gin-gonic/gin"
)

type matchingGetCandidatesSendmailRequestUri struct {
	ID      int64  `uri:"id" binding:"required"`
	Mail    string `json:"mail"`
	Message string `json:"message"`
}

func (p *HandlerProvider) handlerMatchingApiPostCandidatesSendmail(c *gin.Context) {

	// 値セット
	var requestUri matchingGetCandidatesSendmailRequestUri
	if err := c.ShouldBindUri(&requestUri); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.ShouldBindJSON(&requestUri); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logger.Infof("parse request : %#v", requestUri)

	// 取得
	candidate, exists, err := p.d.DomainProvider.GetServices().CandidateService.Get(requestUri.ID)

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	if !exists {
		logger.Errorf("candidate does not exists")
		c.JSON(http.StatusNotFound, gin.H{"error": "データ取得に失敗"})
	}

	// メール送信
	err = p.d.ExternalProvider.GetSendmailService().Send(external.SendmailServiceSendInput{
		Subject: "[ONGAESHI]Offer message from companies",
		TextBody: "Greetings from ONGAESHI\n\n" +
			"You have received offers from companies. Please respond as soon as possible to the jobs that interest you.\n\n" +
			"======================\n" +
			"message: " + requestUri.Message + "\n\n" +
			"email: " + requestUri.Mail + "\n" +
			"======================\n\n" +
			"Please note that the above offers have an expiration date, so please apply as soon as possible if you find a position that interests you.",
		ToAddresses: []string{candidate.MailAddress},
	})

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 更新
	exists, err = p.d.DomainProvider.GetServices().CandidateService.CountUpdate(requestUri.ID, 1)

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !exists {
		logger.Errorf("candidate does not exists")
		c.JSON(http.StatusNotFound, gin.H{"error": "データ取得に失敗"})
	} else {
		c.JSON(http.StatusOK, gin.H{})
	}
}
