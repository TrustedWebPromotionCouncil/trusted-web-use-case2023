package com.brp.data

import com.google.gson.annotations.SerializedName
import net.corda.core.serialization.CordaSerializable

@CordaSerializable
data class VerificationMethod(
    var id: String,
    var type: String,
    var controller: String,
    var publicKeyMultibase: String
)

@CordaSerializable
data class DIDDocument(
    @SerializedName("@context")
    var context: String,
    var id: String,
    var verificationMethod: MutableList<VerificationMethod>
)

@CordaSerializable
data class CredentialSubject(
    val didDocument: DIDDocument,
    val blockHash: String,
    val uuid: String
)








