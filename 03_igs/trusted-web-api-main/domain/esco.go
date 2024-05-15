package domain

type Esco struct {
	EscoId          int64
	EscoDescription string
}

type EscoServiceDependencies struct {
	Persistents PersistentDependencies
}

type EscoService struct {
	d EscoServiceDependencies
}

func (s *EscoService) Get(id int64) (Esco, bool, error) {
	return s.d.Persistents.Esco.Get(id)
}
