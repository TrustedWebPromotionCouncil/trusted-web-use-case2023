package com.brp.data

import net.corda.core.serialization.CordaSerializable

@CordaSerializable
data class GoResKeyName(val keyName: String)

@CordaSerializable
data class GoResPublicKey(val publicKeyMultibase: String)

@CordaSerializable
data class GoReqVC(
    val keyName: String,
    val vcID: String,
    val issuerID: String,
    val issuerName: String,
    val validFrom: String,
    val validUntil: String,
    val credentialSubject: CredentialSubject
)

@CordaSerializable
data class GoReqSingleString(
    val reqString: String
)

@CordaSerializable
data class GoResSingleString(
    val resString: String
)