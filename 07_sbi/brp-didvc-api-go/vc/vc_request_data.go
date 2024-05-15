package vc

type VCRequest struct {
	KeyName           string `json:"keyName" binding:"required"`
	VCID              string `json:"vcID" binding:"required"`
	IssuerID          string `json:"issuerID" binding:"required"`
	IssuerName        string `json:"issuerName" binding:"required"`
	CredentialSubject any    `json:"credentialSubject" binding:"required"`
	ValidFrom         string `json:"validFrom"`
	ValidUntil        string `json:"validUntil"`
}

type VPRequest struct {
	KeyName              string               `json:"keyName" binding:"required"`
	VPID                 string               `json:"vpID" binding:"required"`
	IssuerID             string               `json:"issuerID" binding:"required"`
	VerifiableCredential VerifiableCredential `json:"verifiableCredential" binding:"required"`
}

type VPRequestWithoutVC struct {
	KeyName  string `json:"keyName" binding:"required"`
	VPID     string `json:"vpID" binding:"required"`
	IssuerID string `json:"issuerID" binding:"required"`
}

type VPRequestWithVCList struct {
	KeyName              string                 `json:"keyName" binding:"required"`
	VPID                 string                 `json:"vpID" binding:"required"`
	IssuerID             string                 `json:"issuerID" binding:"required"`
	VerifiableCredential []VerifiableCredential `json:"verifiableCredential" binding:"required"`
}

type VerifySignatureRequest struct {
	PublicKeyMultibase string `json:"publicKeyMultibase" binding:"required"`
	SignatureValue     string `json:"signatureValue" binding:"required"`
	VerifiableObject   any    `json:"verifiableObject" binding:"required"`
}

type SingleStringRequest struct {
	ReqString string `json:"reqString" binding:"required"`
}

type SingleStringResponse struct {
	ResString string `json:"resString" binding:"required"`
}
