package test

import (
	"bytes"
	"fmt"
	"io"
	"net/http"

	"brp-didvc-api-go/helper"
)

func TestVerifySignature(serverURL string) error {

	jsonString := `{"publicKeyMultibase":"zDgLWzPX4fg7ywSqz5hry47MtBtnR7BaoSBmZJLafvAqK","signatureValue":"z53DKHNfLMCbXZ5RLvWD6JskBYxDjCqt9S7gtAW8yuh3hUZ34nudSjFsD18PFUetvnPtL6dxm3hNY1ZK65mmq88eD","verifiableObject":{"@context":["https://www.w3.org/2018/credentials/v2"],"id":"vpID000001","holder":"did:example:BusinessUnitA","type":["VerifiablePresentation"],"verifiableCredential": [{"@context":["https://www.w3.org/2018/credentials/v2"],"id":"vcID000001","type":["VerifiableCredential"],"credentialSubject":{"didDocument":{"@context":"https://w3id.org/did/v1","id":"did:example:VCAuthCom","verificationMethod":[{"controller":"did:example:VCAuthCom","id":"did:example:VCAuthCom1#vcauth-bu2-key","publicKeyMultibase":"zDgLWzPX4fg7ywSqz5hry47MtBtnR7BaoSBmZJLafvAqK","type":"Ed25519VerificationKey2018"}]},"authenticatorInfo":{"digitalCertificateOrganizationName":"JP Digital Certificate Organization 1","digitalCertificateOrganizationCredentialIssuer":"JP Accreditation Organization"},"businessUnitInfo":{"businessUnitName":"事業所","country":"Japan","address":"住所","contactInfo":{"name":"name","department":"department","jobTitle":"jobTitle","contactNumber":"0120111222"}},"legalEntityInfo":{"legalEntityIdentifier":"legal-id","legalEntityName":"事業者","location":"所在地"},"authenticationLevel":"1","revocationEndPoints":["http://dev.detc.link:3001/revoke-1/vc-status/{uuid}","http://dev.detc.link:3001/revoke-2/vc-status/{uuid}"],"linkedVP":{"@context":["https://www.w3.org/2018/credentials/v2"],"id":"vpID11","holder":"did:detc:VCAuthCom1","type":["VerifiablePresentation"],"verifiableCredential":[{"@context":["https://www.w3.org/2018/credentials/v2"],"id":"VCAuthCom1-vcID-Test20230824-01","type":["VerifiableCredential"],"credentialSubject":{"blockHash":"974DD42AD5055F0BC1057DEBFDD1FD29622B780898602C797E83B8EE93C68290","didDocument":{"@context":"https://w3id.org/did/v1","id":"did:detc:VCAuthCom1","verificationMethod":[{"controller":"did:detc:VCAuthCom1","id":"did:detc:VCAuthCom1#vcauth-com1-key","publicKeyMultibase":"z8YdBNxmCRxKUr3WrUNxV1Ut9jdmVtcqPCdxfibX4kbrP","type":"Ed25519VerificationKey2018"}]},"uuid":"893332c4-186c-4b46-ac88-eea301000413"},"issuer":{"id":"did:detc:VCAuthOrg","name":"VCAuthOrg"},"validFrom":"2023-08-24T10:48:43+09:00","validUntil":"2024-08-23T10:48:43+09:00","proof":{"type":"Ed25519Signature2018","created":"2023-08-24T01:48:43Z","proofPurpose":"assertionMethod","verificationMethod":"did:detc:VCAuthOrg#vcauth-org-key","signatureValue":"z5jnkndEV8n8SQohPaoVUpnarCoz6uPuaMfwW47YX2vuMnDPnDcdhr2L4fJouYt6XP8esEFiC37NGF6b3dPi9BNJC"}}],"proof":[{"type":"Ed25519Signature2018","created":"2023-10-25T14:21:45+09:00","proofPurpose":"authentication","verificationMethod":"did:detc:VCAuthCom1#vcauth-consortium1-key","signatureValue":"z5AEyG5jgD4TZHEQ9ddEFk7voH9xZ6xijtVfpWyZPFPc1MJbiu6VRWafQFs4ZgiRABMojECbvXv1dV3aMrxfhv25v"}]},"uuid":"a7c33110-8db6-4b45-a2b0-c1d3262963e4"},"issuer":{"id":"did:detc:VCAuthCom1","name":"JP Digital Certificate Organization 1"},"validFrom":"2023-10-25T14:21:45+09:00","validUntil":"2024-10-25T14:21:45+09:00","proof":{"type":"Ed25519Signature2018","created":"2023-10-25T14:21:45+09:00","proofPurpose":"assertionMethod","verificationMethod":"did:detc:VCAuthCom1#vcauth-consortium1-key","signatureValue":"z2x7T5aBTuG4ZriPih8aRrweBhZqAmA9mtA58LKKJKMayMDbFHb8GJSUYY7JYPcUNgv7d1ruPajAE66HsmnMdp9en"}}]}}`

	// Create a request
	req, err := http.NewRequest("POST", serverURL+"/api/verifySignature", bytes.NewReader([]byte(jsonString)))
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

	// Check the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	helper.GetInfoLogger().Println("response body: ")
	fmt.Println(string(body))

	return nil
}
