package com.ttw.api.usecases

import com.ttw.api.domains.AuthChallenge
import com.ttw.api.domains.AuthId
import com.ttw.api.infrastructure.repositories.AuthChallengeRepository
import com.ttw.api.infrastructure.services.SignatureVerifier
import com.ttw.api.shared.DateTimeProvider
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.mockk.*

internal class AuthenticateUseCaseTest : StringSpec({

    "handle" {
        mockkObject(AuthChallengeRepository, SignatureVerifier) {
            coEvery {
                AuthChallengeRepository.fetchNotExpired(AuthId("auth-id"))
            } returns AuthChallenge(
                authId = AuthId("auth-id"),
                challenge = "challenge1",
                expiredDatetime = DateTimeProvider.utcNow().plusHours(1L)
            )
            coEvery {
                // 実際にDBにアクセスしないようにするためのモック化
                AuthChallengeRepository.delete(any())
            } returns Unit
            every {
                SignatureVerifier.verify(any(), any(), any())
            } returns true

            AuthenticateUseCase.handle(
                authId = AuthId("auth-id"),
                vc = mapOf(
                    "id" to "id",
                    "type" to listOf("type"),
                    "@context" to listOf("@context"),
                    "issuer" to mapOf(
                        "name" to "issuer.name",
                        "id" to "issuer.id",
                    ),
                    "validFrom" to "validFrom",
                    "validUntil" to "validUntil",
                    "credentialSubject" to mapOf(
                        "didDocument" to mapOf(
                            "id" to "didDocument.id",
                            "@context" to "didDocument.@context",
                            "verificationMethod" to listOf(
                                mapOf(
                                    "id" to "verificationMethod.id",
                                    "type" to "verificationMethod.type",
                                    "controller" to "verificationMethod.controller",
                                    "publicKeyMultibase" to "publicKey1",
                                )
                            )
                        ),
                        "businessUnitInfo" to mapOf(
                            "vcID" to "businessUnitInfo.vcID",
                            "country" to "businessUnitInfo.country",
                        ),
                        "legalEntityInfo" to mapOf(
                            "legalEntityIdentifier" to "legalEntityInfo.legalEntityIdentifier",
                            "location" to "legalEntityInfo.location",
                        ),
                        "appliedAuthenticationLevel" to "appliedAuthenticationLevel",
                        "challenge" to "challenge1",
                    ),
                    "proof" to mapOf(
                        "type" to "proof.type",
                        "created" to "proof.created",
                        "proofPurpose" to "proof.proofPurpose",
                        "verificationMethod" to "proof.verificationMethod",
                        "signatureValue" to "signature1",
                    )
                )
            )

            coVerify {
                // challengeが削除されていること
                AuthChallengeRepository.delete(
                    withArg {
                        it.authId shouldBe AuthId("auth-id")
                    }
                )
            }
            verify {
                // issuerはid, nameの順、
                // credentialSubjectはキーが並び変わっていないことを確認
                val expectedMessage = """|
                    |{
                    |"@context":["@context"],
                    |"id":"id",
                    |"type":["type"],
                    |"credentialSubject":{
                    |"didDocument":{
                    |"id":"didDocument.id",
                    |"@context":"didDocument.@context",
                    |"verificationMethod":[{
                    |"id":"verificationMethod.id",
                    |"type":"verificationMethod.type",
                    |"controller":"verificationMethod.controller",
                    |"publicKeyMultibase":"publicKey1"
                    |}]
                    |},
                    |"businessUnitInfo":{
                    |"vcID":"businessUnitInfo.vcID",
                    |"country":"businessUnitInfo.country"
                    |},
                    |"legalEntityInfo":{
                    |"legalEntityIdentifier":"legalEntityInfo.legalEntityIdentifier",
                    |"location":"legalEntityInfo.location"
                    |},
                    |"appliedAuthenticationLevel":"appliedAuthenticationLevel",
                    |"challenge":"challenge1"
                    |},
                    |"issuer":{
                    |"id":"issuer.id",
                    |"name":"issuer.name"
                    |},
                    |"validFrom":"validFrom",
                    |"validUntil":"validUntil"
                    |}
                """.trimMargin().trim().replace("\n", "")
                SignatureVerifier.verify(
                    publicKeyMultibase = "publicKey1",
                    message = expectedMessage,
                    signatureMultibase = "signature1",
                )
            }
        }
    }
})
