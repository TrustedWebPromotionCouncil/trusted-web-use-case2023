// Package database は、データベースアクセスを行うパッケージです。
package database

import (
	"fmt"
	"log"
	"os"

	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

var (
	logger *zap.SugaredLogger
	dbMain *gorm.DB
)

type GormLoggerEnv string

const (
	GormLoggerEnvProduction  = GormLoggerEnv("production")
	GormLoggerEnvDevelopment = GormLoggerEnv("development")
)

type InitDBInput struct {
	Host     string
	User     string
	Password string
	DBName   string
	Port     string
	SslMode  string
	config   *gorm.Config
}

type InitInput struct {
	Logger        *zap.SugaredLogger
	GormLoggerEnv GormLoggerEnv
	DBMain        InitDBInput
}

func Init(input InitInput) error {
	var err error
	var gormConfig *gorm.Config

	logger = input.Logger

	if GormLoggerEnv(input.GormLoggerEnv) == GormLoggerEnvDevelopment {
		gormConfig = gormConfigDevelopment()
	} else {
		gormConfig = gormConfigProduction()
	}

	input.DBMain.config = gormConfig
	dbMain, err = initPostgres(input.DBMain)
	if err != nil {
		return err
	}

	return nil
}

func initPostgres(i InitDBInput) (*gorm.DB, error) {
	logger.Debug(fmt.Sprintf("host=%s user=%s dbname=%s port=%s sslmode=%s", i.Host, i.User, i.DBName, i.Port, i.SslMode))
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN: fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", i.Host, i.User, i.Password, i.DBName, i.Port, i.SslMode),
	}), i.config)
	if err != nil {
		logger.Error(err)
	}
	return db, err
}

func gormConfigDevelopment() *gorm.Config {
	return &gorm.Config{
		Logger: gormlogger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
			gormlogger.Config{
				SlowThreshold:             0,               // Slow SQL threshold
				LogLevel:                  gormlogger.Info, // Log level
				IgnoreRecordNotFoundError: true,            // Ignore ErrRecordNotFound error for logger
				Colorful:                  true,            // Disable color
			},
		),
		DisableForeignKeyConstraintWhenMigrating: true,
	}
}

func gormConfigProduction() *gorm.Config {
	return &gorm.Config{
		Logger: gormlogger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
			gormlogger.Config{
				SlowThreshold:             0,               // Slow SQL threshold
				LogLevel:                  gormlogger.Info, // Log level
				IgnoreRecordNotFoundError: true,            // Ignore ErrRecordNotFound error for logger
				Colorful:                  true,            // Disable color
			},
		),
		DisableForeignKeyConstraintWhenMigrating: true,
	}
}

func GetDBMain() *gorm.DB {
	return dbMain
}
