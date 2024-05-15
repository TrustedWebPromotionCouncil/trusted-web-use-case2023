package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type matchingGetCandidatesLikeRequestUri struct {
	ID int64 `uri:"id" binding:"required"`
}

func (p *HandlerProvider) handlerMatchingApiPostCandidatesLike(c *gin.Context) {

	var requestUri matchingGetCandidatesLikeRequestUri
	if err := c.ShouldBindUri(&requestUri); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	logger.Infof("parse request : %#v", requestUri)

	// カウント
	exists, err := p.d.DomainProvider.GetServices().CandidateService.CountUpdate(requestUri.ID, 2)
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
