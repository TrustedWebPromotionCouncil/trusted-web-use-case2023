package vc

import (
	"crypto/ed25519"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/multiformats/go-multibase"
	"github.com/newrelic/go-agent/v3/newrelic"

	"brp-didvc-api-go/helper"
)

func GetKeyName4AuthOrg(c *gin.Context) {
	helper.GetInfoLogger().Println("GetKeyName4AuthOrg function.")

	keyName := helper.GetKeyName4AuthOrg()

	c.JSON(200, gin.H{"keyName": keyName})
}

func GenerateKeyPair(c *gin.Context) {
	helper.GetInfoLogger().Println("GenerateKeyPair function.")

	keyName := c.Param("keyName")
	helper.GetInfoLogger().Println("keyName: " + keyName)
	if helper.IsValidKeyName(keyName) == false {
		c.JSON(400, gin.H{"error": HTTP_400_BAD_KEY_NAME})
		return
	}

	publicKeyMultibase, error := helper.GenerateKeyPair(keyName)
	if error != nil {
		c.JSON(500, gin.H{"error": error})
		return
	}

	c.JSON(200, gin.H{"publicKeyMultibase": publicKeyMultibase})
}

func GetPublicKeyMultiBase(c *gin.Context) {
	helper.GetInfoLogger().Println("GetPublicKeyMultibase function.")

	keyName := c.Param("keyName")
	vcPublicKeyName := helper.GetPublicKeyName(keyName)

	valueSavedInAws, errGetSecret := helper.GetSecret(helper.AWSCfg, vcPublicKeyName)
	if errGetSecret != nil || valueSavedInAws == "" {
		c.JSON(404, gin.H{"error": HTTP_404_PUBLIC_KEY_NOT_FOUND})
		return
	}

	c.JSON(200, gin.H{"publicKeyMultibase": valueSavedInAws})
}

func IssueVerifiableCredential(c *gin.Context) {
	helper.GetInfoLogger().Println("IssueVerifiableCredential function.")

	requestBodyBytes, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	requestBodyString := string(requestBodyBytes)
	helper.GetInfoLogger().Println("requestBodyString: ")
	helper.GetInfoLogger().Println(requestBodyString)

	var vcRequest VCRequest
	errInRequest := json.Unmarshal(requestBodyBytes, &vcRequest)
	if errInRequest != nil {
		helper.GetErrorLogger().Println(errInRequest)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	keyName := vcRequest.KeyName
	vcID := vcRequest.VCID
	issuerID := vcRequest.IssuerID
	issuerName := vcRequest.IssuerName
	validFrom := vcRequest.ValidFrom
	validUntil := vcRequest.ValidUntil

	if keyName == "" || vcID == "" || issuerID == "" || issuerName == "" || vcRequest.CredentialSubject == "" {
		helper.GetInfoLogger().Println(HTTP_400_ERROR_MSG)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	for _, requestValue := range []string{keyName, vcID, issuerID, issuerName, validFrom, validUntil} {
		if strings.ContainsAny(requestValue, "{}") {
			helper.GetInfoLogger().Println(HTTP_400_FOUND_BRACKET)
			c.JSON(400, gin.H{"error": HTTP_400_FOUND_BRACKET})
			return
		}
	}

	credentialSubjectString := helper.ExtractSubJsonString(requestBodyString)

	vcPrivateKeyName := helper.GetPrivateKeyName(keyName)

	valueSavedInAws, errGetSecret := helper.GetSecret(helper.AWSCfg, vcPrivateKeyName)
	if errGetSecret != nil || valueSavedInAws == "" {
		helper.GetErrorLogger().Println(HTTP_404_PRIVATE_KEY_NOT_FOUND)
		c.JSON(404, gin.H{"error": HTTP_404_PRIVATE_KEY_NOT_FOUND})
		return
	}
	_, issuerPrivateKey, errInMultiBaseDecode := multibase.Decode(valueSavedInAws)
	if errInMultiBaseDecode != nil {
		helper.GetErrorLogger().Println(errInMultiBaseDecode)
		c.JSON(500, gin.H{"error": HTTP_500_MULTI_BASE_DECODE_ERROR})
		return
	}

	currentTime := time.Now()
	if validFrom == "" {
		validFrom = currentTime.Format(time.RFC3339)
	}
	if validUntil == "" {
		validUntil = currentTime.AddDate(1, 0, 0).Format(time.RFC3339)
	}

	tmpCredential := Credential{
		Context:           []string{VC_CONTEXT},
		ID:                vcID,
		Type:              []string{VC_TYPE},
		Issuer:            Issuer{ID: issuerID, Name: issuerName},
		ValidFrom:         validFrom,
		ValidUntil:        validUntil,
		CredentialSubject: "",
	}

	tmpCredentialBytes, errInJsonEncode := json.Marshal(tmpCredential)
	if errInJsonEncode != nil {
		helper.GetErrorLogger().Println(errInJsonEncode)
		c.JSON(500, gin.H{"error": HTTP_500_JSON_ENCODE_ERROR})
		return
	}

	tmpCredentialString := string(tmpCredentialBytes)

	credentialString := strings.Replace(tmpCredentialString,
		`"credentialSubject":""`,
		`"credentialSubject":`+credentialSubjectString,
		1)

	signature := ed25519.Sign(issuerPrivateKey, []byte(credentialString))
	signatureValue, errInMultiBaseEncode := multibase.Encode(multibase.Base58BTC, signature)
	if errInMultiBaseEncode != nil {
		helper.GetErrorLogger().Println(errInMultiBaseEncode)
		c.JSON(500, gin.H{"error": HTTP_500_MULTI_BASE_ENCODE_ERROR})
		return
	}

	verificationMethod := fmt.Sprintf("%s#%s", issuerID, keyName)
	proof := Proof{
		Type:               ENCRYPTION_TYPE,
		Created:            time.Now().Format(time.RFC3339),
		ProofPurpose:       VC_PROOF_PURPOSE,
		VerificationMethod: verificationMethod,
		SignatureValue:     signatureValue,
	}

	proofBytes, errInJsonEncode := json.Marshal(proof)
	if errInJsonEncode != nil {
		helper.GetErrorLogger().Println(errInJsonEncode)
		c.JSON(500, gin.H{"error": HTTP_500_JSON_ENCODE_ERROR})
		return
	}
	proofString := string(proofBytes)

	lastIndex := len(credentialString) - 1
	vcString := credentialString[:lastIndex] + `,"proof":` + proofString + credentialString[lastIndex:]

	helper.GetInfoLogger().Println("responseBodyString: ")
	helper.GetInfoLogger().Println(vcString)

	c.Data(200, "application/json", []byte(vcString))
}

func CreateVerifiablePresentation(c *gin.Context) {
	helper.GetInfoLogger().Println("CreateVerifiablePresentation function.")

	requestBodyBytes, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	var vpRequest VPRequest
	errInRequest := json.Unmarshal(requestBodyBytes, &vpRequest)
	if errInRequest != nil {
		helper.GetErrorLogger().Println(errInRequest)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	createVP(c, requestBodyBytes)
}

func CreateVerifiablePresentation4MultiVCs(c *gin.Context) {
	helper.GetInfoLogger().Println("CreateVerifiablePresentation4MultiVCs function.")

	requestBodyBytes, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	var vpRequest VPRequestWithVCList
	errInRequest := json.Unmarshal(requestBodyBytes, &vpRequest)
	if errInRequest != nil {
		helper.GetErrorLogger().Println(errInRequest)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	createVP(c, requestBodyBytes)
}

func createVP(c *gin.Context, requestBodyBytes []byte) {
	helper.GetInfoLogger().Println("createVP function.")

	requestBodyString := string(requestBodyBytes)
	helper.GetInfoLogger().Println("requestBodyString: ")
	helper.GetInfoLogger().Println(requestBodyString)

	var vpRequest VPRequestWithoutVC
	errInRequest := json.Unmarshal(requestBodyBytes, &vpRequest)
	if errInRequest != nil {
		helper.GetErrorLogger().Println(errInRequest)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	keyName := vpRequest.KeyName
	vpID := vpRequest.VPID
	issuerID := vpRequest.IssuerID

	if keyName == "" || vpID == "" || issuerID == "" {
		helper.GetInfoLogger().Println(HTTP_400_ERROR_MSG)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	for _, requestValue := range []string{keyName, vpID, issuerID} {
		if strings.ContainsAny(requestValue, "{}") {
			helper.GetInfoLogger().Println(HTTP_400_FOUND_BRACKET)
			c.JSON(400, gin.H{"error": HTTP_400_FOUND_BRACKET})
			return
		}
	}

	verifiableCredentialString := "[" + helper.ExtractSubJsonString(requestBodyString) + "]"
	var vcList []VerifiableCredential
	errInVCList := json.Unmarshal([]byte(verifiableCredentialString), &vcList)
	if errInRequest != nil {
		helper.GetErrorLogger().Println(errInVCList)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	vcPrivateKeyName := helper.GetPrivateKeyName(keyName)

	valueSavedInAws, errGetSecret := helper.GetSecret(helper.AWSCfg, vcPrivateKeyName)
	if errGetSecret != nil || valueSavedInAws == "" {
		c.JSON(404, gin.H{"error": HTTP_404_PRIVATE_KEY_NOT_FOUND})
		return
	}
	_, issuerPrivateKey, errInMultiBaseDecode := multibase.Decode(valueSavedInAws)
	if errInMultiBaseDecode != nil {
		helper.GetErrorLogger().Println(errInMultiBaseDecode)
		c.JSON(500, gin.H{"error": HTTP_500_MULTI_BASE_DECODE_ERROR})
		return
	}

	presentationMetaData := PresentationMetaData{
		Context: []string{VC_CONTEXT},
		ID:      vpID,
		Type:    []string{VP_TYPE},
		Holder:  issuerID,
	}

	presentationMetaDataBytes, errInJsonEncode := json.Marshal(presentationMetaData)
	if errInJsonEncode != nil {
		helper.GetErrorLogger().Println(errInJsonEncode)
		c.JSON(500, gin.H{"error": HTTP_500_JSON_ENCODE_ERROR})
		return
	}
	presentationMetaDataString := string(presentationMetaDataBytes)
	presentationMetaDataLastIndex := len(presentationMetaDataString) - 1
	presentationString := presentationMetaDataString[:presentationMetaDataLastIndex] + `,"verifiableCredential":` + verifiableCredentialString + "}"

	signature := ed25519.Sign(issuerPrivateKey, []byte(presentationString))
	signatureValue, errInMultiBaseEncode := multibase.Encode(multibase.Base58BTC, signature)
	if errInMultiBaseEncode != nil {
		helper.GetErrorLogger().Println(errInMultiBaseEncode)
		c.JSON(500, gin.H{"error": HTTP_500_MULTI_BASE_ENCODE_ERROR})
		return
	}

	proof := Proof{
		Type:               ENCRYPTION_TYPE,
		Created:            time.Now().Format(time.RFC3339),
		ProofPurpose:       VP_PROOF_PURPOSE,
		VerificationMethod: issuerID + "#" + keyName,
		SignatureValue:     signatureValue,
	}

	proofBytes, errInJsonEncode := json.Marshal(proof)
	if errInJsonEncode != nil {
		helper.GetErrorLogger().Println(errInJsonEncode)
		c.JSON(500, gin.H{"error": HTTP_500_JSON_ENCODE_ERROR})
		return
	}
	proofString := string(proofBytes)

	lastIndex := len(presentationString) - 1
	vpString := presentationString[:lastIndex] + `,"proof":[` + proofString + `]}`

	helper.GetInfoLogger().Println("responseBodyString: ")
	helper.GetInfoLogger().Println(vpString)

	c.Data(200, "application/json", []byte(vpString))
}

func VerifySignature(c *gin.Context) {
	helper.GetInfoLogger().Println("CreateVerifiablePresentation4MultiVCs function.")

	requestBodyBytes, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	var verifySignatureRequest VerifySignatureRequest
	errInRequest := json.Unmarshal(requestBodyBytes, &verifySignatureRequest)
	if errInRequest != nil {
		helper.GetInfoLogger().Println(errInRequest)
		c.JSON(400, gin.H{"error": HTTP_400_ERROR_MSG})
		return
	}

	verifiableObjectString := helper.ExtractSubJsonString(string(requestBodyBytes))

	_, signature, err := multibase.Decode(verifySignatureRequest.SignatureValue)
	if err != nil {
		helper.GetErrorLogger().Printf("error in decoding signature: %v", err)
		c.JSON(500, gin.H{"error": HTTP_500_MULTI_BASE_DECODE_ERROR})
		return
	}

	_, publicKey, err := multibase.Decode(verifySignatureRequest.PublicKeyMultibase)
	if err != nil {
		helper.GetErrorLogger().Printf("error in decoding publicKey: %v", err)
		c.JSON(500, gin.H{"error": HTTP_500_MULTI_BASE_DECODE_ERROR})
		return
	}

	if !ed25519.Verify(publicKey, []byte(verifiableObjectString), signature) {
		helper.GetErrorLogger().Printf("signature verification failed")
		c.JSON(200, gin.H{"result": "Invalid"})
		return
	}

	c.JSON(200, gin.H{"result": "Valid"})
}

func NewRelicTest(c *gin.Context) {
	helper.GetInfoLogger().Println("NewRelicTest function.")

	appName := os.Getenv("NEW_RELIC_APP_NAME")
	if appName == "" {
		appName = NEW_RELIC_APP_NAME
	}

	newRelicLicenseKey := os.Getenv("NEW_RELIC_LICENSE_KEY")
	if newRelicLicenseKey == "" {
		panic("NEW_RELIC_LICENSE_KEY not found.")
	}

	newrelicClient, newrelicErr := newrelic.NewApplication(
		newrelic.ConfigAppName(appName),
		newrelic.ConfigLicense(newRelicLicenseKey),
	)
	if newrelicErr != nil {
		panic(newrelicErr)
	}

	nrTxn := newrelicClient.StartTransaction("gin-api-handler")
	defer nrTxn.End()

	segment1 := nrTxn.StartSegment("sleep 5 sec.")
	time.Sleep(5 * time.Second)
	segment1.End()

	segment2 := nrTxn.StartSegment("work.")
	c.JSON(200, gin.H{"new relic version": "v1.0"})
	segment2.End()

	segment3 := nrTxn.StartSegment("sleep 2 sec.")
	time.Sleep(2 * time.Second)
	segment3.End()
}

func Version(c *gin.Context) {
	helper.GetInfoLogger().Println("Version function.")
	c.JSON(200, gin.H{"version": "v1.0"})
}
