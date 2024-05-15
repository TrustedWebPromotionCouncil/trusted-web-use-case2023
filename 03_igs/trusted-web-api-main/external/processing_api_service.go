package external

type processingApiService struct {
	endpoint string
}

type processingApiServiceDependencies struct {
	Endpoint string
}

func newProcessingApiService(d processingApiServiceDependencies) (*processingApiService, error) {
	return &processingApiService{
		endpoint: d.Endpoint,
	}, nil
}
