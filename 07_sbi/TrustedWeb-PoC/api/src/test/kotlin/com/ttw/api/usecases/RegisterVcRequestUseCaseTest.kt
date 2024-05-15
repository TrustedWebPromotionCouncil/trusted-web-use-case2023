package com.ttw.api.usecases

import com.ttw.api.Config
import com.ttw.api.DigitalCertificateOrganizationConfig
import com.ttw.api.domains.Organization
import com.ttw.api.domains.RequestId
import com.ttw.api.infrastructure.repositories.BusinessVcRequestRepository
import com.ttw.api.infrastructure.services.*
import com.ttw.api.shared.DateTimeProvider
import io.kotest.assertions.json.shouldEqualJson
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.maps.shouldContain
import io.kotest.matchers.maps.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.mockk.*
import java.time.LocalDateTime

internal class RegisterVcRequestUseCaseTest : StringSpec({

    "handle" {
        mockkObject(
            VcUuidProvider,
            VpIdProvider,
            LinkedVpProvider,
            SignedVcProvider,
            RequestId,
            DateTimeProvider,
            BusinessVcRequestRepository,
            Config
        ) {
            coEvery {
                VcUuidProvider.issueUuid()
            } returns "uuid"
            coEvery {
                VpIdProvider.issueVpId()
            } returns "vpID1"
            coEvery {
                LinkedVpProvider.generateLinkedVp(any())
            } returns mapOf(
                "holder" to "holder"
            )
            coEvery {
                SignedVcProvider.generateSignedVc(
                    vcId = any(),
                    issuerId = any(),
                    issuerName = any(),
                    validFrom = any(),
                    validUntil = any(),
                    credentialSubject = any(),
                )
            } returns mapOf(
                "signedVc" to "signedVc"
            )
            every {
                RequestId.generate()
            } returns RequestId("requestId")
            every {
                DateTimeProvider.utcNow()
            } returns LocalDateTime.of(2023, 1, 1, 0, 0, 0)
            every {
                Config.digitalCertificateOrganization
            } returns DigitalCertificateOrganizationConfig(
                id = "id",
                name = "name",
                credentialIssuer = "credentialIssuer",
            )
            every {
                Config.externalService.revocation_endpoints
            } returns "http://host1/{variable},http://host2/{variable}"
            coEvery {
                BusinessVcRequestRepository.store(any())
            } returns Unit

            val result: VcRequestOutput = RegisterVcRequestUseCase.handle(
                rawVc = mapOf(
                    "id" to "id",
                    "credentialSubject" to mapOf(
                        "didDocument" to "didDocument",
                        "businessUnitInfo" to mapOf(
                            "businessUnitName" to "businessUnitName",
                            "country" to "country",
                        ),
                        "legalEntityInfo" to mapOf(
                            "legalEntityIdentifier" to "legalEntityIdentifier",
                            "legalEntityName" to "legalEntityName",
                            "location" to "location",
                        ),
                        "authenticationLevel" to "1",
                        "revocationEndPoints" to "revocationEndPoints",
                        "challenge" to "challenge"
                    ),
                ),
                organization = Organization.AUTHORITY_1,
            )

            result shouldBe VcRequestOutput(
                requestId = "requestId",
                status = CertificationResult.Approved,
                vc = mapOf("signedVc" to "signedVc")
            )

            coVerify {
                LinkedVpProvider.generateLinkedVp("vpID1")
                SignedVcProvider.generateSignedVc(
                    vcId = "id",
                    issuerId = "holder",
                    issuerName = "name",
                    validFrom = LocalDateTime.of(2023, 1, 1, 0, 0, 0),
                    validUntil = LocalDateTime.of(2024, 1, 1, 0, 0, 0),
                    credentialSubject = withArg<Map<String, *>> {
                        it shouldHaveSize 8
                        it.shouldContain("didDocument" to "didDocument")
                        it.shouldContain(
                            "authenticatorInfo" to mapOf(
                                "digitalCertificateOrganizationName" to "name",
                                "digitalCertificateOrganizationCredentialIssuer" to "credentialIssuer",
                            )
                        )
                        JsonSerializer.serialize(it["businessUnitInfo"].shouldNotBeNull()) shouldEqualJson """{
                            | "businessUnitName": "businessUnitName",
                            | "country": "country"
                            |}
                        """.trimMargin()
                        JsonSerializer.serialize(it["legalEntityInfo"].shouldNotBeNull()) shouldEqualJson """{
                            | "legalEntityIdentifier": "legalEntityIdentifier",
                            | "legalEntityName": "legalEntityName",
                            | "location": "location"
                            |}
                        """.trimMargin()
                        it.shouldContain("authenticationLevel" to "1")
                        it.shouldContain(
                            "revocationEndPoints" to listOf(
                                "http://host1/{variable}",
                                "http://host2/{variable}",
                            )
                        )
                        it.shouldContain(
                            "linkedVP" to mapOf(
                                "holder" to "holder"
                            )
                        )
                        it.shouldContain("uuid" to "uuid")
                    }
                )
            }
        }
    }
})
