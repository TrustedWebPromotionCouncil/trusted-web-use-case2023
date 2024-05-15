package logger

import (
	"fmt"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Env string

const (
	EnvProduction  = Env("production")
	EnvDevelopment = Env("development")
	EnvTesting     = Env("testing")
)

const (
	DevelopmentTimeLayout = "2006/01/02 15:04:05.000"
)

func newRequestLogger(env Env) (*zap.Logger, error) {
	requestLogger, err := buildRequestLogger(env)
	if err != nil {
		return nil, err
	}
	return requestLogger, nil
}

func newAppLogger(env Env, levelStr string) (*zap.SugaredLogger, error) {
	level, err := zapcore.ParseLevel(levelStr)
	if err != nil {
		return nil, err
	}

	appLogger, err := buildAppLogger(env, level)
	if err != nil {
		return nil, err
	}
	return appLogger, nil
}

func buildAppLogger(env Env, level zapcore.Level) (*zap.SugaredLogger, error) {
	switch env {
	case EnvDevelopment:
		logger, err := appLoggerDevelopmentConfig(level).Build()
		if err != nil {
			return nil, err
		}
		return logger.Sugar(), nil
	case EnvProduction:
		logger, err := appLoggerProductionConfig(level).Build()
		if err != nil {
			return nil, err
		}
		return logger.Sugar(), nil
	case EnvTesting:
		logger, err := appLoggerTestingConfig(level).Build()
		if err != nil {
			return nil, err
		}
		return logger.Sugar(), nil

	default:
		return nil, fmt.Errorf("[buildAppLogger] unknown logger env: %s", env)
	}
}

func buildRequestLogger(env Env) (*zap.Logger, error) {
	switch env {
	case EnvDevelopment:
		return requestLoggerDevelopmentConfig().Build()
	case EnvProduction:
		return requestLoggerProductionConfig().Build()
	case EnvTesting:
		return requestLoggerTestingConfig().Build()
	default:
		return nil, fmt.Errorf("[buildrequestLogger] unknown logger env: %s", env)
	}
}

func appLoggerDevelopmentConfig(level zapcore.Level) zap.Config {
	return zap.Config{
		Level:       zap.NewAtomicLevelAt(level),
		Development: true,
		Encoding:    "console",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        zapcore.OmitKey,
			LevelKey:       "level",
			NameKey:        "name",
			CallerKey:      "caller",
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "message",
			StacktraceKey:  "stacktrace",
			EncodeLevel:    zapcore.CapitalColorLevelEncoder,
			EncodeTime:     zapcore.TimeEncoderOfLayout(DevelopmentTimeLayout),
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}
}

func requestLoggerDevelopmentConfig() zap.Config {
	return zap.Config{
		Level:       zap.NewAtomicLevelAt(zapcore.DebugLevel),
		Development: true,
		Encoding:    "console",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        "time",
			LevelKey:       zapcore.OmitKey,
			NameKey:        "name",
			CallerKey:      zapcore.OmitKey,
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "message",
			StacktraceKey:  "stacktrace",
			EncodeLevel:    zapcore.CapitalColorLevelEncoder,
			EncodeTime:     zapcore.TimeEncoderOfLayout(DevelopmentTimeLayout),
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}
}

func appLoggerProductionConfig(level zapcore.Level) zap.Config {
	return zap.Config{
		Level:       zap.NewAtomicLevelAt(level),
		Development: false,
		Sampling: &zap.SamplingConfig{
			Initial:    100,
			Thereafter: 100,
		},
		Encoding: "json",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        "time",
			LevelKey:       "level",
			NameKey:        "name",
			CallerKey:      "caller",
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "message",
			StacktraceKey:  "stacktrace",
			LineEnding:     zapcore.DefaultLineEnding,
			EncodeLevel:    zapcore.LowercaseLevelEncoder,
			EncodeTime:     zapcore.EpochTimeEncoder,
			EncodeDuration: zapcore.SecondsDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{"stderr"},
		ErrorOutputPaths: []string{"stderr"},
		InitialFields:    map[string]interface{}{"logtype": "app"},
	}
}

func requestLoggerProductionConfig() zap.Config {
	return zap.Config{
		Level:       zap.NewAtomicLevelAt(zapcore.InfoLevel),
		Development: false,
		Sampling: &zap.SamplingConfig{
			Initial:    100,
			Thereafter: 100,
		},
		Encoding: "json",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        "time",
			LevelKey:       "level",
			NameKey:        "name",
			CallerKey:      "caller",
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "message",
			StacktraceKey:  "stacktrace",
			LineEnding:     zapcore.DefaultLineEnding,
			EncodeLevel:    zapcore.LowercaseLevelEncoder,
			EncodeTime:     zapcore.EpochTimeEncoder,
			EncodeDuration: zapcore.SecondsDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{"stderr"},
		ErrorOutputPaths: []string{"stderr"},
		InitialFields:    map[string]interface{}{"logtype": "request"},
	}
}

func appLoggerTestingConfig(level zapcore.Level) zap.Config {
	return zap.Config{
		Level:       zap.NewAtomicLevelAt(zapcore.DPanicLevel),
		Development: true,
		Encoding:    "console",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        zapcore.OmitKey,
			LevelKey:       "level",
			NameKey:        "name",
			CallerKey:      "caller",
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "message",
			StacktraceKey:  "stacktrace",
			EncodeLevel:    zapcore.CapitalColorLevelEncoder,
			EncodeTime:     zapcore.TimeEncoderOfLayout(DevelopmentTimeLayout),
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}
}

func requestLoggerTestingConfig() zap.Config {
	return zap.Config{
		Level:       zap.NewAtomicLevelAt(zapcore.DPanicLevel),
		Development: true,
		Encoding:    "console",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        "time",
			LevelKey:       zapcore.OmitKey,
			NameKey:        "name",
			CallerKey:      zapcore.OmitKey,
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "message",
			StacktraceKey:  "stacktrace",
			EncodeLevel:    zapcore.CapitalColorLevelEncoder,
			EncodeTime:     zapcore.TimeEncoderOfLayout(DevelopmentTimeLayout),
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}
}
