package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"

	_ "brp-didvc-api-go/init"
	"brp-didvc-api-go/vc"
)

func main() {

	app := gin.Default()
	pprof.Register(app)

	apiRouter := app.Group("/api")
	apiRouter.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"POST", "GET", "OPTIONS"},
		AllowHeaders: []string{"Authorization", "Content-Type"}}))

	apiRouter.GET("/version", vc.Version)
	apiRouter.GET("/keyName4AuthOrg", vc.GetKeyName4AuthOrg)

	apiRouter.POST("/generateKeyPair/:keyName", vc.GenerateKeyPair)
	apiRouter.GET("/publicKeyMultibase/:keyName", vc.GetPublicKeyMultiBase)
	apiRouter.POST("/vc", vc.IssueVerifiableCredential)
	apiRouter.POST("/vp", vc.CreateVerifiablePresentation)
	apiRouter.POST("/vp4MultiVCs", vc.CreateVerifiablePresentation4MultiVCs)
	apiRouter.POST("/verifySignature", vc.VerifySignature)

	apiRouter.POST("/didStringFromX500Name", vc.DidStringFromX500Name)
	apiRouter.POST("/didStringToX500Name", vc.DidStringToX500Name)

	app.Run(":8080")
}
