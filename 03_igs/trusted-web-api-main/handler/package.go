package handler

import (
	"go.uber.org/zap"
)

var logger *zap.SugaredLogger

func Init(l *zap.SugaredLogger) {
	logger = l
}
