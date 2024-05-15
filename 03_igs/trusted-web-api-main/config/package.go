package config

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

var config Config

type Config struct {
	Server   Server
	Logger   Logger
	Database Database
	Endpoint Endpoint
	Url      Url
	Aws      Aws
	Mail     Mail
}

type Server struct {
	Port            int    `required:"true"`
	HealthcheckPath string `required:"true" split_words:"true"`
	GeneralHostName string `required:"true" split_words:"true"`
}

type Logger struct {
	Env   string `default:"production"`
	Level string `default:"error"`
}

type DatabasePostgres struct {
	Host     string `required:"true" split_words:"true"`
	User     string `required:"true" split_words:"true"`
	Password string `required:"true" split_words:"true"`
	DBName   string `required:"true" split_words:"true"`
	Port     string `required:"true" split_words:"true"`
	SslMode  string `required:"true" split_words:"true"`
}

type Database struct {
	Main DatabasePostgres `required:"true" split_words:"true"`
}

type Endpoint struct {
	MatchingApi   string `required:"true" split_words:"true"`
	ProcessingApi string `required:"true" split_words:"true"`
}

type UrlStorage struct {
	Main string `required:"true" split_words:"true"`
}

type UrlUi struct {
	Matching string `required:"true" split_words:"true"`
}

type Url struct {
	Storage UrlStorage `required:"true" split_words:"true"`
	Ui      UrlUi      `required:"true" split_words:"true"`
}

type Aws struct {
	Profile                        string     `required:"false" split_words:"true"`
	Region                         string     `required:"true" split_words:"true"`
	Buckets                        AwsBuckets `required:"true" split_words:"true"`
	BucketPublicBasePath           string     `required:"true" split_words:"true"`
	CloudfrontSignKeyId            string     `required:"true" split_words:"true"`
	CloudfrontSignPrivateKeyPem    string     `required:"true" split_words:"true"`
	CloudfrontSignedUrlExpireHours int        `required:"true" split_words:"true"`
}

type AwsBuckets struct {
	Main string `required:"true" split_words:"true"`
}

type Mail struct {
	FromAddress string `required:"true" split_words:"true"`
}

func Init() error {
	var err error

	// .envファイルがある場合(=ローカル環境)はロード
	// ECS環境はタスクの実行環境に環境変数が設定されている
	err = godotenv.Load()
	if err == nil {
		log.Println("Loading .env file")
	}

	err = envconfig.Process("server", &config.Server)
	fmt.Printf("server config: %v\n", config.Server)
	if err != nil {
		return err
	}

	err = envconfig.Process("logger", &config.Logger)
	fmt.Printf("logger config: %v\n", config.Logger)
	if err != nil {
		return err
	}

	err = envconfig.Process("database", &config.Database)
	fmt.Printf("database config: %v\n", config.Database)
	if err != nil {
		return err
	}

	err = envconfig.Process("endpoint", &config.Endpoint)
	fmt.Printf("endpoint config: %v\n", config.Endpoint)
	if err != nil {
		return err
	}

	err = envconfig.Process("url", &config.Url)
	fmt.Printf("url config: %v\n", config.Url)
	if err != nil {
		return err
	}

	err = envconfig.Process("aws", &config.Aws)
	fmt.Printf("aws config: %v\n", config.Aws)
	if err != nil {
		return err
	}

	err = envconfig.Process("mail", &config.Mail)
	fmt.Printf("mail config: %v\n", config.Mail)
	if err != nil {
		return err
	}

	return nil
}

func Get() *Config {
	return &config
}
