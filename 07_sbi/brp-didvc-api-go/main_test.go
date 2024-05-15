package main

import (
	"fmt"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"

	"brp-didvc-api-go/helper"
	_ "brp-didvc-api-go/init"
	vcTest "brp-didvc-api-go/test"
	"brp-didvc-api-go/vc"
)

func Benchmark(b *testing.B) {
	helper.GetInfoLogger().Println("Benchmark function.")
	myTest()
}

func Test(t *testing.T) {
	helper.GetInfoLogger().Println("Test function.")
	myTest()
}

func myTest() {
	// Create a Gin router
	app := gin.Default()
	apiRouter := app.Group("/api")

	apiRouter.POST("/generateKeyPair/:keyName", vc.GenerateKeyPair)
	apiRouter.GET("/publicKeyMultibase/:keyName", vc.GetPublicKeyMultiBase)
	apiRouter.POST("/vc", vc.IssueVerifiableCredential)
	apiRouter.POST("/vp", vc.CreateVerifiablePresentation)
	apiRouter.POST("/vp4MultiVCs", vc.CreateVerifiablePresentation4MultiVCs)
	apiRouter.POST("/verifySignature", vc.VerifySignature)

	apiRouter.POST("/didStringFromX500Name", vc.DidStringFromX500Name)
	apiRouter.POST("/didStringToX500Name", vc.DidStringToX500Name)

	// Create a mock HTTP server
	server := httptest.NewServer(app)

	keyName := helper.AWS_SECRET_DEFAULT_KEY_NAME

	// errInGenerateKeyPair := vcTest.TestGenerateKeyPair(server.URL, keyName)
	// if errInGenerateKeyPair != nil {
	// 	fmt.Println("Error happened in TestGenerateKeyPair: ")
	// 	fmt.Println(errInGenerateKeyPair)
	// 	return
	// }

	errInGetPublicKey := vcTest.TestGetPublicKey(server.URL, keyName)
	if errInGetPublicKey != nil {
		fmt.Println("Error happened in TestGetPublicKey: ")
		fmt.Println(errInGetPublicKey)
		return
	}

	errInVC := vcTest.TestVC(server.URL, keyName)
	if errInVC != nil {
		fmt.Println("Error happened in TestVC: ")
		fmt.Println(errInVC)
	}

	errInVP := vcTest.TestVP(server.URL, keyName)
	if errInVP != nil {
		fmt.Println("Error happened in TestVP: ")
		fmt.Println(errInVP)
	}

	errInDID := vcTest.TestDID(server.URL)
	if errInDID != nil {
		fmt.Println("Error happened in TestDID: ")
		fmt.Println(errInVP)
	}

	errInVP4MultiVCs := vcTest.TestVP4MultiVCs(server.URL, keyName)
	if errInVP4MultiVCs != nil {
		fmt.Println("Error happened in TestVP4MultiVCs: ")
		fmt.Println(errInVP4MultiVCs)
	}

	errInVerifySignature := vcTest.TestVerifySignature(server.URL)
	if errInVerifySignature != nil {
		fmt.Println("Error happened in TestVerifySignature: ")
		fmt.Println(errInVerifySignature)
	}
}
