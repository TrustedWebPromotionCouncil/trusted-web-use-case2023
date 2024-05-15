package logger

import (
	"fmt"

	"go.uber.org/zap"
)

type LoggerProvider struct {
	appLogger     *zap.SugaredLogger
	requestLogger *zap.Logger
}

type Dependencies struct {
	Env   Env
	Level string
}

func NewLoggerProvider(d Dependencies) (*LoggerProvider, error) {
	appLogger, err := newAppLogger(d.Env, d.Level)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	requestLogger, err := newRequestLogger(d.Env)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return &LoggerProvider{
		appLogger:     appLogger,
		requestLogger: requestLogger,
	}, nil
}

func (p *LoggerProvider) GetAppLogger() *zap.SugaredLogger {
	return p.appLogger
}

func (p *LoggerProvider) GetRequestLogger() *zap.Logger {
	return p.requestLogger
}
