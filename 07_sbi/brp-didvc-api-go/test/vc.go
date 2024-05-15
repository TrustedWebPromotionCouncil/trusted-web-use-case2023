package test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"

	"brp-didvc-api-go/helper"
	"brp-didvc-api-go/vc"
)

func TestVC(serverURL string, keyName string) error {
	randomNumber := rand.Uint64()

	credentialSubject := fmt.Sprintf(`
	{
		"didDocument": {
			"@context": "https://w3id.org/did/v1",
			"id": "did:example:GUi5XHMycjqd1pe",
			"verificationMethod": [
			{
				"id": "did:example:GUi5XHMycjqd1pe#key1",
				"type": "Ed25519VerificationKey2018",
				"controller": "did:example:GUi5XHMycjqd1pe",
				"publicKeyMultibase": "zGUi5XHMycjqd1peZWCnHDaSNFU29bwnRj6cytUjxTEjP"
			}
			]
		},
		"randomNumber": "%d",
		"levelOfAuth": "level1",
		"statusOfAuth": "Valid"
	}`, randomNumber)

	dynamicData := make(map[string]interface{})
	errInDynamicData := json.Unmarshal([]byte(credentialSubject), &dynamicData)
	if errInDynamicData != nil {
		return errInDynamicData
	}

	// credentialSubject = strings.Replace(credentialSubject, "\n", "", -1)
	// credentialSubject = strings.Replace(credentialSubject, "\r", "", -1)
	// credentialSubject = strings.Replace(credentialSubject, "\t", "", -1)
	// credentialSubject = strings.Replace(credentialSubject, " ", "", -1)

	vcRequest := vc.VCRequest{
		KeyName:           keyName,
		VCID:              "http://example.com/vc/3732",
		IssuerID:          "did:example:5rA3HVWnNUwjhUW",
		IssuerName:        "VCAuthCom1",
		CredentialSubject: dynamicData,
	}

	jsonData, err := json.Marshal(vcRequest)
	if err != nil {
		return err
	}

	// Create a request
	req, err := http.NewRequest("POST", serverURL+"/api/vc", bytes.NewReader(jsonData))
	if err != nil {
		return err
	}

	// Set the Content-Type header to application/json
	req.Header.Set("Content-Type", "application/json")

	// Make a request to the server
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("Expected status code 200, got %d", resp.StatusCode)
	}

	// Check the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	vc := vc.VerifiableCredential{}
	errInJsonUnmarshal := json.Unmarshal(body, &vc)
	if errInJsonUnmarshal != nil {
		return errInJsonUnmarshal
	}

	helper.GetInfoLogger().Println("VC Pretty Json: ")
	helper.GetInfoLogger().Println(helper.ToPrettyJSON(vc))

	return nil
}
