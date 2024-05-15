package app

import (
	"fmt"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/config"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/database"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/external"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/handler"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/logger"
)

type Dependencies struct {
	LoggerProvider   *logger.LoggerProvider
	DomainProvider   *domain.DomainProvider
	ExternalProvider *external.ExternalProvider
	HandlerProvider  *handler.HandlerProvider
}

func Init() Dependencies {
	var d Dependencies
	var err error

	// Config
	err = config.Init()
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	cnf := config.Get()

	// Logger Provider
	d.LoggerProvider, err = logger.NewLoggerProvider(logger.Dependencies{
		Env:   logger.Env(cnf.Logger.Env),
		Level: cnf.Logger.Level,
	})
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	appLogger := d.LoggerProvider.GetAppLogger()

	// Database init
	var gormLoggerEnv database.GormLoggerEnv
	if logger.Env(cnf.Logger.Env) == logger.EnvDevelopment {
		gormLoggerEnv = database.GormLoggerEnvDevelopment
	} else {
		gormLoggerEnv = database.GormLoggerEnvProduction
	}
	err = database.Init(database.InitInput{
		Logger:        appLogger,
		GormLoggerEnv: gormLoggerEnv,
		DBMain: database.InitDBInput{
			Host:     cnf.Database.Main.Host,
			User:     cnf.Database.Main.User,
			Password: cnf.Database.Main.Password,
			DBName:   cnf.Database.Main.DBName,
			Port:     cnf.Database.Main.Port,
			SslMode:  cnf.Database.Main.SslMode,
		},
	})
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

	// External provider
	external.Init(appLogger)
	d.ExternalProvider, err = external.NewExternalProvider(external.Dependencies{
		Profile:                     config.Get().Aws.Profile,
		Region:                      config.Get().Aws.Region,
		FromAddress:                 config.Get().Mail.FromAddress,
		Bucket:                      config.Get().Aws.Buckets.Main,
		CloudfrontSignKeyId:         config.Get().Aws.CloudfrontSignKeyId,
		CloudfrontSignPrivateKeyPem: config.Get().Aws.CloudfrontSignPrivateKeyPem,
		StorageMainUrl:              config.Get().Url.Storage.Main,
		SignedUrlExpireHours:        config.Get().Aws.CloudfrontSignedUrlExpireHours,
		PublicBasePath:              config.Get().Aws.BucketPublicBasePath,
		ProcessingApiEndpoint:       config.Get().Endpoint.ProcessingApi,
		MatchingApiEndpoint:         config.Get().Endpoint.MatchingApi,
	})
	if err != nil {
		appLogger.Fatal(err)
	}

	// Domain provider
	domain.Init(appLogger)
	d.DomainProvider, err = domain.NewDomainProvider(domain.Dependencies{
		Persistents: domain.PersistentDependencies{
			Candidate:    &database.Candidate{},
			Esco:         &database.Esco{},
			EncryptKey:   &database.EncryptKey{},
			VectorWeight: &database.VectorWeight{},
		},
	})
	if err != nil {
		appLogger.Fatal(err)
	}

	// Handler provider
	handler.Init(appLogger)
	d.HandlerProvider, err = handler.NewHandlerProvider(handler.Dependencies{
		Env:              cnf.Logger.Env,
		DomainProvider:   d.DomainProvider,
		ExternalProvider: d.ExternalProvider,
	})
	if err != nil {
		appLogger.Fatal(err)
	}

	return d
}
