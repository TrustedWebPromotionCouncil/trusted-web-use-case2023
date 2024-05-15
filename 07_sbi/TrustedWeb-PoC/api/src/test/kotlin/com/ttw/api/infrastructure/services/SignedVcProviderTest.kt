package com.ttw.api.infrastructure.services

import com.github.tomakehurst.wiremock.client.WireMock
import com.ttw.api.Config
import com.ttw.api.testutils.TestUtils.registerListener
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkObject
import java.time.LocalDateTime

internal class SignedVcProviderTest : StringSpec({

    val (mockServer, port) = registerListener()

    "generateSignedVc" {
        mockkObject(Config, HttpClientUtils) {
            every {
                Config.externalService
            } returns mockk {
                every {
                    keyNameUrl
                } returns "http://localhost:$port/api/keyName4AuthOrg"
                every {
                    vcUrl
                } returns "http://localhost:$port/api/vc"
            }
            coEvery {
                HttpClientUtils.keyName()
            } returns "keyName"

            mockServer.stubFor(
                WireMock.post(WireMock.urlPathMatching(".*/vc"))
                    .willReturn(WireMock.jsonResponse("""{"vcKey": "vcValue"}""", 200))
            )

            val result = SignedVcProvider.generateSignedVc(
                vcId = "vcId",
                issuerId = "issuerId",
                issuerName = "issuerName",
                validFrom = LocalDateTime.of(2023, 1, 1, 0, 0, 0),
                validUntil = LocalDateTime.of(2023, 2, 1, 0, 0, 0),
                credentialSubject = mapOf(
                    "key" to "value"
                )
            )

            result shouldBe mapOf(
                "vcKey" to "vcValue"
            )

            val inputJson = """{
                | "keyName": "keyName",
                | "vcID": "vcId",
                | "issuerId": "issuerId",
                | "issuerName": "issuerName",
                | "validFrom": "2023-01-01T09:00:00+09:00",
                | "validUntil": "2023-02-01T09:00:00+09:00",
                | "credentialSubject": {
                |  "key": "value"
                | }
                |}
            """.trimMargin()
            mockServer.verify(
                WireMock.postRequestedFor(WireMock.urlMatching(".*/vc"))
                    .withRequestBody(WireMock.equalToJson(inputJson))
            )
        }
    }
})
