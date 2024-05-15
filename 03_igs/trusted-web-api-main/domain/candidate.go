package domain

import (
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

type Candidate struct {
	Id               int64
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

type CandidateVectorCalcResult struct {
	Knowledge  float64
	Experience float64
	Cognition  float64
	Community  float64
	Attitude   float64
}

func (u CandidateVectorCalcResult) EncryptRLWE(enc *ckks.CalculatorUsingPublickey) *rlwe.Ciphertext {
	v := enc.NewVector()
	for i, e := range []float64{
		u.Knowledge,
		u.Experience,
		u.Cognition,
		u.Community,
		u.Attitude,
	} {
		v[i] = float64(e)
	}

	return enc.Encrypt(v)
}

func (u *CandidateVectorCalcResult) DecyptRLWE(ct *rlwe.Ciphertext, dec *ckks.CalculatorUsingSecretkey) {
	v := dec.Decrypt(ct)
	for i, e := range []*float64{
		&u.Knowledge,
		&u.Experience,
		&u.Cognition,
		&u.Community,
		&u.Attitude,
	} {
		*e = float64(real(v[i]))
	}
}

type CandidateServiceDependencies struct {
	Persistents PersistentDependencies
}

type CandidateService struct {
	d CandidateServiceDependencies
}

func (s *CandidateService) Get(id int64) (Candidate, bool, error) {
	return s.d.Persistents.Candidate.Get(id)
}

func (s *CandidateService) GetAll(sortType string) ([]Candidate, bool, error) {
	return s.d.Persistents.Candidate.GetAll(sortType)
}

func (s *CandidateService) CountUpdate(id int64, column int64) (bool, error) {
	return s.d.Persistents.Candidate.CountUpdate(id, column)
}

func (s *CandidateService) Create() (int64, error) {
	return s.d.Persistents.Candidate.Create()
}

func (s *CandidateService) UpdateProfile(id int64, v CandidateProfile) (bool, error) {
	return s.d.Persistents.Candidate.UpdateProfile(id, v)
}

func (s *CandidateService) UpdateVector(id int64, v CandidateVector) (bool, error) {
	return s.d.Persistents.Candidate.UpdateVector(id, v)
}

func (s *CandidateService) UpdateVectorCalcResult(id int64, v CandidateVectorCalcResult) (bool, error) {
	return s.d.Persistents.Candidate.UpdateVectorCalcResult(id, v)
}

func (s *CandidateService) UpdateEncryptKey(id int64, v CandidateEncryptKey) (bool, error) {
	return s.d.Persistents.Candidate.UpdateEncryptKey(id, v)
}

func (s *CandidateService) GetEncryptKey(id int64) (CandidateEncryptKey, bool, error) {
	return s.d.Persistents.Candidate.GetEncryptKey(id)
}
