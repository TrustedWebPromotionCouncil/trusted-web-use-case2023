package domain

import (
	"go.uber.org/zap"
)

var logger *zap.SugaredLogger

// Init は、domainパッケージの初期化を行います。
func Init(l *zap.SugaredLogger) {
	logger = l
}
