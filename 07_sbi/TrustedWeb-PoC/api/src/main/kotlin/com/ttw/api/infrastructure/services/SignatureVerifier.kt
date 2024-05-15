package com.ttw.api.infrastructure.services

import io.ipfs.multibase.Multibase
import org.bouncycastle.crypto.params.Ed25519PublicKeyParameters
import org.bouncycastle.crypto.signers.Ed25519Signer

object SignatureVerifier {
    fun verify(publicKeyMultibase: String, message: String, signatureMultibase: String): Boolean {
        val publicKeyBytes = Multibase.decode(publicKeyMultibase)
        val publicKeyParameters = Ed25519PublicKeyParameters(publicKeyBytes)

        val verifier = Ed25519Signer().also {
            it.init(false, publicKeyParameters)
        }

        val serializedBytes = message.toByteArray()
        verifier.update(serializedBytes, 0, serializedBytes.size)

        val signatureBytes = Multibase.decode(signatureMultibase)
        return verifier.verifySignature(signatureBytes)
    }
}
