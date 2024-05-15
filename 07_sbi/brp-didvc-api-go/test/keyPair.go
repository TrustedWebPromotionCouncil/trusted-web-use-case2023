package test

import (
	"fmt"
	"io"
	"net/http"

	"brp-didvc-api-go/helper"
)

func TestGenerateKeyPair(serverURL string, keyName string) error {

	// Create a request
	req, err := http.NewRequest("POST", serverURL+"/api/generateKeyPair/"+keyName, nil)
	if err != nil {
		return err
	}

	// Make a request to the server
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("Error: %#v", resp)
	}

	// Check the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	helper.GetInfoLogger().Println("response body: ")
	fmt.Println(string(body))

	return nil
}

func TestGetPublicKey(serverURL string, keyName string) error {

	// Create a request
	req, err := http.NewRequest("GET", serverURL+"/api/publicKeyMultibase/"+keyName, nil)
	if err != nil {
		return err
	}

	// Make a request to the server
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("Error: %#v", resp)
	}

	// Check the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	helper.GetInfoLogger().Println("response body: ")
	fmt.Println(string(body))

	return nil
}
