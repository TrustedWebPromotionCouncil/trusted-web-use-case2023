package test

import (
	"brp-didvc-api-go/vc"
	"encoding/json"
	"fmt"
	"math/rand"
)

func GenerateVC4Test() (vc.VerifiableCredential, error) {

	randomNumber := rand.Uint64()
	verifiableCredentialString := fmt.Sprintf(`
	{
		"@context": [
		  "https://www.w3.org/2018/credentials/v2"
		],
		"id": "http://example.com/vc/3732",
		"type": [
		  "VerifiableCredential"
		],
		"credentialSubject": {
		  "didDocument": {
			"@context": "https://w3id.org/did/v1",
			"id": "did:example:GUi5XHMycjqd1pe",
			"verificationMethod": [
			  {
				"controller": "did:example:GUi5XHMycjqd1pe",
				"id": "did:example:GUi5XHMycjqd1pe#key1",
				"publicKeyMultibase": "zGUi5XHMycjqd1peZWCnHDaSNFU29bwnRj6cytUjxTEjP",
				"type": "Ed25519VerificationKey2018"
			  }
			]
		  },
		  "randomNumber": "%d",
		  "levelOfAuth": "level1",
		  "statusOfAuth": "Valid"
		},
		"issuer": {
		  "id": "did:example:5rA3HVWnNUwjhUW",
		  "name": "VCAuthCom1"
		},
		"validFrom": "2023-06-06T13:18:01+09:00",
		"validUntil": "2024-06-06T13:18:01+09:00",
		"proof": {
		  "type": "Ed25519Signature2018",
		  "created": "2023-06-06T13:18:01+09:00",
		  "proofPurpose": "assertionMethod",
		  "verificationMethod": "did:example:5rA3HVWnNUwjhUW#key1",
		  "signatureValue": "...mocked signature..."
		}
	}`, randomNumber)

	verifiableCredential := vc.VerifiableCredential{}
	errInJsonUnmarshal := json.Unmarshal([]byte(verifiableCredentialString), &verifiableCredential)
	if errInJsonUnmarshal != nil {
		return vc.VerifiableCredential{}, errInJsonUnmarshal
	}

	return verifiableCredential, nil
}
