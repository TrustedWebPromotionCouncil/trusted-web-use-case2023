package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type MatchingGetCandidatesIdResponse struct {
	ID               int64  `json:"id"`
	Age              int64  `json:"age"`
	Gender           string `json:"gender"`
	Residence        string `json:"residence"`
	Ability          int64  `json:"ability"`
	DesiredSalary    int64  `json:"desiredSalary"`
	OfferCount       int64  `json:"offerCount"`
	LikeCount        int64  `json:"likeCount"`
	OfferAmount      int64  `json:"offerAmount"`
	EscoDescription  string `json:"escoRankDescription"`
	EscoRank         int64  `json:"escoRank"`
	SelfIntroduction string `json:"selfIntroduction"`
	HardSkill        int64  `json:"hardSkill"`
	SoftSkill        int64  `json:"softSkill"`
	Knowledge        int64  `json:"knowledge"`
	IsKnowledge      bool   `json:"isKnowledge"`
	Experience       int64  `json:"experience"`
	IsExperience     bool   `json:"isExperience"`
	Cognition        int64  `json:"cognition"`
	IsCognition      bool   `json:"isCognition"`
	Community        int64  `json:"community"`
	IsCommunity      bool   `json:"isCommunity"`
	Attitude         int64  `json:"attitude"`
	IsAttitude       bool   `json:"isAttitude"`
	Manner           int64  `json:"manner"`
	IsManner         bool   `json:"isManner"`
	Engaged          int64  `json:"engaged"`
	IsEngaged        bool   `json:"isEngaged"`
}

type matchingGetCandidatesIdRequestUri struct {
	ID        int64  `uri:"id" binding:"required"`
	Abilitypt string `form:"abilitypt"`
}

func (p *HandlerProvider) handlerMatchingApiGetCandidatesId(c *gin.Context) {

	var requestUri matchingGetCandidatesIdRequestUri
	_ = c.ShouldBind(&requestUri)
	if err := c.ShouldBindUri(&requestUri); err != nil {
		logger.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	logger.Infof("parse request : %#v", requestUri)

	candidate, exists, err := p.d.DomainProvider.GetServices().CandidateService.Get(requestUri.ID)

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !exists {
		logger.Errorf("candidate does not exists")
		c.JSON(http.StatusNotFound, gin.H{"error": "データ取得に失敗"})
	}

	esco, exists, err := p.d.DomainProvider.GetServices().EscoService.Get(candidate.EscoId)

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !exists {
		logger.Errorf("esco does not exists")
		c.JSON(http.StatusNotFound, gin.H{"error": "データ取得に失敗"})
	} else {
		ab := candidate.Ability1
		if requestUri.Abilitypt == "2" {
			ab = candidate.Ability2
		} else if requestUri.Abilitypt == "3" {
			ab = candidate.Ability3
		}
		c.JSON(http.StatusOK, MatchingGetCandidatesIdResponse{
			ID:               candidate.Id,
			Age:              candidate.Age,
			Gender:           candidate.Gender,
			Residence:        candidate.Residence,
			Ability:          ab,
			DesiredSalary:    candidate.DesiredSalary / 10000,
			OfferCount:       candidate.OfferCount,
			LikeCount:        candidate.LikeCount,
			OfferAmount:      candidate.OfferAmount,
			EscoDescription:  esco.EscoDescription,
			EscoRank:         candidate.EscoId,
			SelfIntroduction: candidate.SelfIntroduction,
			HardSkill:        candidate.HardSkill,
			SoftSkill:        candidate.SoftSkill,
			Knowledge:        candidate.Knowledge,
			IsKnowledge:      candidate.IsKnowledge,
			Experience:       candidate.Experience,
			IsExperience:     candidate.IsExperience,
			Cognition:        candidate.Cognition,
			IsCognition:      candidate.IsCognition,
			Community:        candidate.Community,
			IsCommunity:      candidate.IsCommunity,
			Attitude:         candidate.Attitude,
			IsAttitude:       candidate.IsAttitude,
			Manner:           candidate.Manner,
			IsManner:         candidate.IsManner,
			Engaged:          candidate.Engaged,
			IsEngaged:        candidate.IsEngaged,
		})
	}
}
