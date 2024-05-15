package vc

import (
	"encoding/base64"
	"strings"

	"brp-didvc-api-go/helper"

	"github.com/gin-gonic/gin"
)

func DidStringFromX500Name(c *gin.Context) {
	helper.GetInfoLogger().Println("DidStringFromX500Name function.")

	var singleStringRequest SingleStringRequest
	errInRequest := c.ShouldBindJSON(&singleStringRequest)
	if errInRequest != nil {
		helper.GetErrorLogger().Println(errInRequest)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	helper.GetInfoLogger().Println("Request body: ")
	helper.GetInfoLogger().Println(singleStringRequest.ReqString)

	res := SingleStringResponse{
		ResString: customBase64Encode(singleStringRequest.ReqString),
	}
	c.JSON(200, res)
}

func DidStringToX500Name(c *gin.Context) {
	helper.GetInfoLogger().Println("DidStringToX500Name function.")

	var singleStringRequest SingleStringRequest
	errInRequest := c.ShouldBindJSON(&singleStringRequest)
	if errInRequest != nil {
		helper.GetErrorLogger().Println(errInRequest)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	helper.GetInfoLogger().Println("Request body: ")
	helper.GetInfoLogger().Println(singleStringRequest.ReqString)

	res, errInBase64Decode := customBase64Decode(singleStringRequest.ReqString)
	if errInBase64Decode != nil {
		helper.GetErrorLogger().Println(errInBase64Decode)
		c.JSON(500, gin.H{"error": HTTP_500_BASE64_DECODE_ERROR})
		return
	}

	c.JSON(200, SingleStringResponse{ResString: res})
}

func customBase64Encode(input string) string {
	// Encode the input string to base64
	encoded := base64.StdEncoding.EncodeToString([]byte(input))

	// Replace characters as specified
	encoded = strings.ReplaceAll(encoded, "+", "%2B")
	encoded = strings.ReplaceAll(encoded, "/", "%2F")
	encoded = strings.ReplaceAll(encoded, "=", "%3D")

	return encoded
}

func customBase64Decode(encoded string) (string, error) {
	// Revert the character replacements
	encoded = strings.ReplaceAll(encoded, "%2B", "+")
	encoded = strings.ReplaceAll(encoded, "%2F", "/")
	encoded = strings.ReplaceAll(encoded, "%3D", "=")

	// Decode the modified base64 string
	decodedBytes, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return "", err
	}

	return string(decodedBytes), nil
}
