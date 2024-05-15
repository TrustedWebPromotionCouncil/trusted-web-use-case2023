package main

import (
	"fmt"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/app"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/config"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/logger"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
)

var d app.Dependencies

func init() {
	d = app.Init()
}

func main() {
	cnf := config.Get()

	e := gin.New()

	e.Use(d.LoggerProvider.LoggingRequest(d.LoggerProvider.GetRequestLogger(), logger.Env(cnf.Logger.Env), []string{cnf.Server.HealthcheckPath}))
	e.Use(ginzap.RecoveryWithZap(d.LoggerProvider.GetRequestLogger(), true))

	d.HandlerProvider.Register(e)

	e.Run(fmt.Sprintf(":%d", config.Get().Server.Port))
}
