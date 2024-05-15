package external

import (
	"encoding/json"
	"fmt"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"
)

type matchingApiService struct {
	endpoint string
}

type matchingApiServiceDependencies struct {
	Endpoint string
}

func newMatchingApiService(d matchingApiServiceDependencies) (*matchingApiService, error) {
	return &matchingApiService{
		endpoint: d.Endpoint,
	}, nil
}

type getMatchingApiCandidateOutput struct {
	UserId           int64
	EscoId           int64
	MailAddress      string
	Age              int64
	Gender           string
	Residence        string
	Ability1         int64
	Ability2         int64
	Ability3         int64
	DesiredSalary    int64
	LikeCount        int64
	OfferAmount      int64
	OfferCount       int64
	SelfIntroduction string
	HardSkill        int64
	SoftSkill        int64
	Knowledge        int64
	IsKnowledge      bool
	Experience       int64
	IsExperience     bool
	Cognition        int64
	IsCognition      bool
	Community        int64
	IsCommunity      bool
	Attitude         int64
	IsAttitude       bool
	Manner           int64
	IsManner         bool
	Engaged          int64
	IsEngaged        bool
}

func (s *matchingApiService) GetCandidate(i domain.MatchingApiGetCandidateInput) (domain.Candidate, error) {
	resp, err := httpRequest(httpRequestInput{
		uri:    fmt.Sprintf("%s/candidate", s.endpoint),
		method: "GET",
	})
	if err != nil {
		logger.Error(err)
		return domain.Candidate{}, err
	}

	var output getMatchingApiCandidateOutput
	err = json.Unmarshal(resp, &output)
	if err != nil {
		logger.Error(err)
		return domain.Candidate{}, err
	}

	return domain.Candidate{
		Id:               output.UserId,
		EscoId:           output.EscoId,
		MailAddress:      output.MailAddress,
		Age:              output.Age,
		Gender:           output.Gender,
		Residence:        output.Residence,
		Ability1:         output.Ability1,
		Ability2:         output.Ability2,
		Ability3:         output.Ability3,
		DesiredSalary:    output.DesiredSalary,
		LikeCount:        output.LikeCount,
		OfferAmount:      output.OfferAmount,
		OfferCount:       output.OfferCount,
		SelfIntroduction: output.SelfIntroduction,
		HardSkill:        output.HardSkill,
		SoftSkill:        output.SoftSkill,
		Knowledge:        output.Knowledge,
		IsKnowledge:      output.IsKnowledge,
		Experience:       output.Experience,
		IsExperience:     output.IsExperience,
		Cognition:        output.Cognition,
		IsCognition:      output.IsCognition,
		Community:        output.Community,
		IsCommunity:      output.IsCommunity,
		Attitude:         output.Attitude,
		IsAttitude:       output.IsAttitude,
		Manner:           output.Manner,
		IsManner:         output.IsManner,
		Engaged:          output.Engaged,
		IsEngaged:        output.IsEngaged,
	}, nil
}

type getMatchingApiEscoOutput struct {
	EscoId          int64
	EscoDescription string
}

func (s *matchingApiService) GetEsco(i domain.MatchingApiGetEscoInput) (domain.Esco, error) {
	resp, err := httpRequest(httpRequestInput{
		uri:    fmt.Sprintf("%s/esco", s.endpoint),
		method: "GET",
	})
	if err != nil {
		logger.Error(err)
		return domain.Esco{}, err
	}

	var output getMatchingApiEscoOutput
	err = json.Unmarshal(resp, &output)
	if err != nil {
		logger.Error(err)
		return domain.Esco{}, err
	}

	return domain.Esco{
		EscoId:          output.EscoId,
		EscoDescription: output.EscoDescription,
	}, nil
}

func (c matchingApiService) SystemPlanXGetEncryptedWeights() (resp *apiio.ResponseMatchingSystemPlanXGetEncryptedWeights, err error) {
	body, err := httpRequest(httpRequestInput{
		uri:    fmt.Sprintf("%s/matching/system/planX/encrypted_weights", c.endpoint),
		method: "GET",
	})
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}

	return
}

func (c matchingApiService) SystemPlanXPostSecretCalculationResult(req *apiio.RequestMatchingSystemPlanXPostSecretCalculationResult) error {
	payload, err := json.Marshal(req)
	if err != nil {
		return err
	}

	_, err = httpRequest(httpRequestInput{
		uri:    fmt.Sprintf("%s/matching/system/planX/secret_calculation_result", c.endpoint),
		method: "POST",
		body:   payload,
	})
	if err != nil {
		logger.Error(err)
		return err
	}

	return nil
}

func (c matchingApiService) SystemPlanYGetEncryptedWeights(userId int64) (resp *apiio.ResponseMatchingSystemPlanYGetEncryptedWeights, err error) {
	body, err := httpRequest(httpRequestInput{
		uri:    fmt.Sprintf("%s/matching/system/planY/encrypted_weights/%d", c.endpoint, userId),
		method: "GET",
	})
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}

	return
}
