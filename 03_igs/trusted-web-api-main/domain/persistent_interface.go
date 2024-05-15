package domain

type CandidatePersistent interface {
	Get(int64) (Candidate, bool, error)
	GetAll(string) ([]Candidate, bool, error)
	CountUpdate(int64, int64) (bool, error)
	Create() (int64, error)
	UpdateProfile(int64, CandidateProfile) (bool, error)
	UpdateVector(int64, CandidateVector) (bool, error)
	UpdateVectorCalcResult(int64, CandidateVectorCalcResult) (bool, error)

	GetEncryptKey(int64) (CandidateEncryptKey, bool, error)
	UpdateEncryptKey(int64, CandidateEncryptKey) (bool, error)
}

type CandidatePersistentGetCandidateInput struct {
	UserId int64
}
type CandidatePersistentGetAllCandidateInput struct {
	SortType string
}
type CandidatePersistentUpdateCandidateInput struct {
	UserId int64
	Column string
}

type EscoPersistent interface {
	Get(int64) (Esco, bool, error)
}

type EscoPersistentGetEscoInput struct {
	EscoId int64
}
type EscoPersistentUpdateEscoInput struct {
	EscoId int64
}

type EncryptKeyPersistent interface {
	Create() (int64, error)
	Get() (EncryptKey, bool, error)
}

type VectorWeightPersistent interface {
	Create(VectorWeight) (int64, error)
	Get() (VectorWeight, bool, error)
}
