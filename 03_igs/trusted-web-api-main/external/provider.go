package external

import (
	"time"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
)

type Dependencies struct {
	Profile                     string
	Region                      string
	FromAddress                 string
	Bucket                      string
	CloudfrontSignKeyId         string
	CloudfrontSignPrivateKeyPem string
	StorageMainUrl              string
	SignedUrlExpireHours        int
	PublicBasePath              string
	ProcessingApiEndpoint       string
	MatchingApiEndpoint         string
}

type ExternalProvider struct {
	sendmailService      SendmailService
	storageService       StorageService
	processingApiService domain.ProcessingApiExternalService
	matchingApiService   domain.MatchingApiExternalService
}

func NewExternalProvider(d Dependencies) (*ExternalProvider, error) {
	var err error
	sendmailService, err := newAwsSendmailService(awsSendmailServiceDependencies{
		Profile:     d.Profile,
		Region:      d.Region,
		FromAddress: d.FromAddress,
	})
	if err != nil {
		logger.Info(err)
		return nil, err
	}

	storageService, err := newAwsStorageService(awsStorageServiceDependencies{
		Profile:                     d.Profile,
		Region:                      d.Region,
		Bucket:                      d.Bucket,
		CloudfrontSignKeyId:         d.CloudfrontSignKeyId,
		CloudfrontSignPrivateKeyPem: d.CloudfrontSignPrivateKeyPem,
		StorageMainUrl:              d.StorageMainUrl,
		SignedUrlExpireDuration:     time.Duration(d.SignedUrlExpireHours) * time.Hour,
		PublicBasePath:              d.PublicBasePath,
	})
	if err != nil {
		logger.Info(err)
		return nil, err
	}

	processingApiService, err := newProcessingApiService(processingApiServiceDependencies{
		Endpoint: d.ProcessingApiEndpoint,
	})
	if err != nil {
		logger.Info(err)
		return nil, err
	}
	matchingApiService, err := newMatchingApiService(matchingApiServiceDependencies{
		Endpoint: d.MatchingApiEndpoint,
	})
	if err != nil {
		logger.Info(err)
		return nil, err
	}

	return &ExternalProvider{
		sendmailService:      sendmailService,
		storageService:       storageService,
		processingApiService: processingApiService,
		matchingApiService:   matchingApiService,
	}, nil
}

func (p *ExternalProvider) GetSendmailService() SendmailService {
	return p.sendmailService
}

func (p *ExternalProvider) GetStorageService() StorageService {
	return p.storageService
}

func (p *ExternalProvider) GetProcessingApiService() domain.ProcessingApiExternalService {
	return p.processingApiService
}

func (p *ExternalProvider) GetMatchingApiService() domain.MatchingApiExternalService {
	return p.matchingApiService
}
