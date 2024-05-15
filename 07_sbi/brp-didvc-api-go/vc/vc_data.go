package vc

type Proof struct {
	Type               string `json:"type"`
	Created            string `json:"created"`
	ProofPurpose       string `json:"proofPurpose"`
	VerificationMethod string `json:"verificationMethod"`
	SignatureValue     string `json:"signatureValue"`
}

type Issuer struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Credential struct {
	Context           []string `json:"@context"`
	ID                string   `json:"id"`
	Type              []string `json:"type"`
	CredentialSubject any      `json:"credentialSubject"`
	Issuer            Issuer   `json:"issuer"`
	ValidFrom         string   `json:"validFrom"`
	ValidUntil        string   `json:"validUntil"`
}

type VerifiableCredential struct {
	Context           []string `json:"@context"`
	ID                string   `json:"id"`
	Type              []string `json:"type"`
	CredentialSubject any      `json:"credentialSubject"`
	Issuer            Issuer   `json:"issuer"`
	ValidFrom         string   `json:"validFrom"`
	ValidUntil        string   `json:"validUntil"`
	Proof             Proof    `json:"proof"`
}

type PresentationMetaData struct {
	Context []string `json:"@context"`
	ID      string   `json:"id"`
	Holder  string   `json:"holder"`
	Type    []string `json:"type"`
}

type Presentation struct {
	Context              []string               `json:"@context"`
	ID                   string                 `json:"id"`
	Holder               string                 `json:"holder"`
	Type                 []string               `json:"type"`
	VerifiableCredential []VerifiableCredential `json:"verifiableCredential"`
}

type VerifiablePresentation struct {
	Context              []string               `json:"@context"`
	ID                   string                 `json:"id"`
	Holder               string                 `json:"holder"`
	Type                 []string               `json:"type"`
	VerifiableCredential []VerifiableCredential `json:"verifiableCredential"`
	Proof                []Proof                `json:"proof"`
}
