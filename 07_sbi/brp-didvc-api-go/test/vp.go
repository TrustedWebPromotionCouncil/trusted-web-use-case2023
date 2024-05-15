package test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"brp-didvc-api-go/helper"
	"brp-didvc-api-go/vc"
)

func TestVP(serverURL string, keyName string) error {
	verifiableCredential, err := GenerateVC4Test()
	if err != nil {
		return err
	}

	vpRequest := vc.VPRequest{
		KeyName:              keyName,
		VPID:                 "http://example.com/vp/3737",
		IssuerID:             "did:example:5rA3HVWnNUwjhUW",
		VerifiableCredential: verifiableCredential,
	}

	jsonData, err := json.Marshal(vpRequest)
	if err != nil {
		return err
	}

	// Create a request
	req, err := http.NewRequest("POST", serverURL+"/api/vp", bytes.NewReader(jsonData))
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

	vp := vc.VerifiablePresentation{}
	errInVPJsonUnmarshal := json.Unmarshal(body, &vp)
	if errInVPJsonUnmarshal != nil {
		return errInVPJsonUnmarshal
	}

	helper.GetInfoLogger().Println("VP Pretty Json: ")
	helper.GetInfoLogger().Println(helper.ToPrettyJSON(vp))

	return nil
}
