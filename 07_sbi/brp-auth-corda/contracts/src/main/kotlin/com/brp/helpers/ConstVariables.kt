package com.brp.helpers


object ConstVariables {

    const val VCValidStatus = "Valid"
    const val VCRevokedStatus = "Revoked"
    const val VCUnknownStatus = "Unknown"
    const val RevocationMngCompanyNamePrefix = "VCAuthOrgConsortium"
    val RevocationMngCompanyNameRegex = Regex("^${RevocationMngCompanyNamePrefix}\\d{6}$")

    const val InternalGoAPIURL="http://brp-api-go:8080"

    const val DIDScheme = "did:detc"
    const val DIDContext = "https://w3id.org/did/v1"
    const val VerificationMethodType = "Ed25519VerificationKey2018"

    const val RPC_ROLE_AUTH_ORG = "AUTH_ORG" //公的機関
    const val RPC_ROLE_AUTH_ORG_CONSORTIUM = "AUTH_ORG_CONSORTIUM" //失効管理体のCONSORTIUM
    const val RPC_ROLE_AUTH_COMPANY = "AUTH_COMPANY" //公的機関
}