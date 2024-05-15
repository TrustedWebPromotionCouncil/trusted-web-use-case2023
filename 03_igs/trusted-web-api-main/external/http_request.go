package external

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

type httpRequestInput struct {
	uri    string
	method string
	body   []byte
}

func httpRequest(i httpRequestInput) ([]byte, error) {
	client := &http.Client{}
	req, err := http.NewRequest(i.method, i.uri, bytes.NewBuffer(i.body))
	if err != nil {
		logger.Error(err)
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	logger.Debug(req)

	resp, err := client.Do(req)
	if err != nil {
		logger.Error(err)
		return nil, err
	}
	defer resp.Body.Close()
	logger.Debug(resp)

	respBodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	logger.Debug(string(respBodyBytes))
	logger.Debug(len(respBodyBytes))

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return respBodyBytes, nil
	} else {
		err := fmt.Errorf("uri: %s, status: %d", i.uri, resp.StatusCode)
		logger.Error(err)
		return respBodyBytes, err
	}
}
