package handler

import (
	"net/http"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/gin-gonic/gin"
)

type matchingGetCandidatesRequestUri struct {
	SortType  string `form:"sortType"`
	Abilitypt string `form:"abilitypt"`
}

type MatchingGetCandidatesResponse struct {
	ID            int64  `json:"id"`
	Age           int64  `json:"age"`
	Gender        string `json:"gender"`
	Residence     string `json:"residence"`
	Ability       int64  `json:"ability"`
	DesiredSalary int64  `json:"desiredSalary"`
	HardSkill     int64  `json:"hardSkill"`
	SoftSkill     int64  `json:"softSkill"`
	OfferCount    int64  `json:"offerCount"`
}

func (p *HandlerProvider) handlerMatchingApiGetCandidates(c *gin.Context) {

	// 値セット
	var requestUri matchingGetCandidatesRequestUri
	_ = c.ShouldBind(&requestUri)
	sortTp := requestUri.SortType

	if sortTp == "ability" {
		sortTp = sortTp + requestUri.Abilitypt
	}
	logger.Infof("parse request : %#v", requestUri)

	candidate, exists, err := p.d.DomainProvider.GetServices().CandidateService.GetAll(sortTp)

	if err != nil {
		logger.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if !exists {
		logger.Errorf("candidate does not exists")
		c.JSON(http.StatusNotFound, gin.H{"error": "データ取得に失敗"})
	} else {
		var res []MatchingGetCandidatesResponse
		for _, v := range candidate {
			res = append(res, convertModel(v, requestUri.Abilitypt))
		}
		c.JSON(http.StatusOK, res)
	}

}

func convertModel(s domain.Candidate, pt string) MatchingGetCandidatesResponse {
	ab := s.Ability1
	if pt == "2" {
		ab = s.Ability2
	} else if pt == "3" {
		ab = s.Ability3
	}
	c := MatchingGetCandidatesResponse{
		ID:            s.Id,
		Age:           s.Age,
		Gender:        s.Gender,
		Residence:     s.Residence,
		Ability:       ab,
		DesiredSalary: s.DesiredSalary / 10000,
		HardSkill:     s.HardSkill,
		SoftSkill:     s.SoftSkill,
		OfferCount:    s.OfferCount,
	}
	return c
}
