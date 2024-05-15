package domain

type Dependencies struct {
	Persistents PersistentDependencies
	External    ExternalDependencies
}

type PersistentDependencies struct {
	Candidate    CandidatePersistent
	Esco         EscoPersistent
	EncryptKey   EncryptKeyPersistent
	VectorWeight VectorWeightPersistent
}

type ExternalDependencies struct {
}

type DomainProvider struct {
	d        Dependencies
	services *Services
	models   *Models
}

type Services struct {
	CandidateService    CandidateService
	EscoService         EscoService
	EncryptKeyService   EncryptKeyService
	VectorWeightService VectorWeightService
}

type Models struct {
}

func NewDomainProvider(d Dependencies) (*DomainProvider, error) {
	candidateService := CandidateService{
		d: CandidateServiceDependencies{
			Persistents: d.Persistents,
		},
	}
	escoService := EscoService{
		d: EscoServiceDependencies{
			Persistents: d.Persistents,
		},
	}
	encryptKeyService := EncryptKeyService{
		d: EncryptKeyServiceDependencies{
			Persistents: d.Persistents,
		},
	}
	vectorWeightService := VectorWeightService{
		d: VectorWeightServiceDependencies{
			Persistents: d.Persistents,
		},
	}

	return &DomainProvider{
		d: d,
		services: &Services{
			CandidateService:    candidateService,
			EscoService:         escoService,
			EncryptKeyService:   encryptKeyService,
			VectorWeightService: vectorWeightService,
		},
	}, nil
}

func (p *DomainProvider) GetServices() *Services {
	return p.services
}

func (p *DomainProvider) GetModels() *Models {
	return p.models
}
