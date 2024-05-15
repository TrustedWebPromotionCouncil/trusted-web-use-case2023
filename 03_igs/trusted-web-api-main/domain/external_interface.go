package domain

import "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/apiio"

type ProcessingApiExternalService interface {
}

type MatchingApiExternalService interface {
	GetCandidate(MatchingApiGetCandidateInput) (Candidate, error)
	GetEsco(MatchingApiGetEscoInput) (Esco, error)

	SystemPlanXGetEncryptedWeights() (*apiio.ResponseMatchingSystemPlanXGetEncryptedWeights, error)
	SystemPlanXPostSecretCalculationResult(*apiio.RequestMatchingSystemPlanXPostSecretCalculationResult) error

	SystemPlanYGetEncryptedWeights(int64) (*apiio.ResponseMatchingSystemPlanYGetEncryptedWeights, error)
}

type MatchingApiGetCandidateInput struct {
	UserId int `json:"userId"`
}

type MatchingApiGetEscoInput struct {
	EscoId int `json:"escoId"`
}
