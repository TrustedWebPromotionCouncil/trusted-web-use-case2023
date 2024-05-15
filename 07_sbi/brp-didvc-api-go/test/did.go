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

func TestDID(serverURL string) error {
	x500Name1 := "OU=AuthDept, O=VCAuthOrg, L=Tokyo, C=JP"
	didString, err := didStringFromX500Name(serverURL, x500Name1)
	if err != nil {
		return err
	}

	x500Name2, err := didStringToX500Name(serverURL, didString)
	if err != nil {
		return err
	}

	if x500Name1 != x500Name2 {
		return fmt.Errorf("Expected x500 name was not equally transformed. org x500 name: %s, transformed x500 name: %s ", x500Name1, x500Name2)
	}

	return nil
}

func didStringFromX500Name(serverURL string, x500Name string) (string, error) {

	request := vc.SingleStringRequest{
		ReqString: x500Name,
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		return "", err
	}

	// Create a request
	req, err := http.NewRequest("POST", serverURL+"/api/didStringFromX500Name", bytes.NewReader(jsonData))
	if err != nil {
		return "", err
	}

	// Set the Content-Type header to application/json
	req.Header.Set("Content-Type", "application/json")

	// Make a request to the server
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Expected status code 200, got %d", resp.StatusCode)
	}

	// Check the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	singleStringResponse := vc.SingleStringResponse{}
	errInJsonUnmarshal := json.Unmarshal(body, &singleStringResponse)
	if errInJsonUnmarshal != nil {
		return "", errInJsonUnmarshal
	}

	helper.GetInfoLogger().Println("response body: ")
	helper.GetInfoLogger().Println(helper.ToPrettyJSON(singleStringResponse))

	return singleStringResponse.ResString, nil
}

func didStringToX500Name(serverURL string, didString string) (string, error) {

	request := vc.SingleStringRequest{
		ReqString: didString,
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		return "", err
	}

	// Create a request
	req, err := http.NewRequest("POST", serverURL+"/api/didStringToX500Name", bytes.NewReader(jsonData))
	if err != nil {
		return "", err
	}

	// Set the Content-Type header to application/json
	req.Header.Set("Content-Type", "application/json")

	// Make a request to the server
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	// Check the response status code
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Expected status code 200, got %d", resp.StatusCode)
	}

	// Check the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	singleStringResponse := vc.SingleStringResponse{}
	errInJsonUnmarshal := json.Unmarshal(body, &singleStringResponse)
	if errInJsonUnmarshal != nil {
		return "", errInJsonUnmarshal
	}

	helper.GetInfoLogger().Println("response body: ")
	helper.GetInfoLogger().Println(helper.ToPrettyJSON(singleStringResponse))

	return singleStringResponse.ResString, nil
}
