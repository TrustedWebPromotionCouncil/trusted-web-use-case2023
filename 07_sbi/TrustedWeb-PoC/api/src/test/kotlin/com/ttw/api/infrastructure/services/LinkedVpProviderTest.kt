package com.ttw.api.infrastructure.services

import com.github.tomakehurst.wiremock.client.WireMock
import com.ttw.api.Config
import com.ttw.api.shared.DateTimeProvider
import com.ttw.api.testutils.TestUtils.registerListener
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.mockk.*
import java.time.OffsetDateTime
import java.time.ZoneOffset

internal class LinkedVpProviderTest : StringSpec({

    val (mockServer, port) = registerListener()

    beforeTest {
        mockkObject(Config, HttpClientUtils)
        every {
            Config.externalService
        } returns mockk {
            every {
                vcJsonListUtl
            } returns "http://localhost:$port/brp/corda/vc-json-list"
            every {
                vpUrl
            } returns "http://localhost:$port/api/vp"
        }
        coEvery {
            HttpClientUtils.keyName()
        } returns "key"
    }

    afterTest {
        unmockkObject(Config, HttpClientUtils)
    }

    "generateLinkedVp" {
        val vcJsonListContent = """[
            |{
            |"credentialSubject": {
            | "didDocument": {
            |  "verificationMethod": [{
            |   "controller": "controller"
            |  }]
            | }
            |},
            |"proof": {
            | "created": "2023-09-01T00:00:00+09:00"
            |}
            |}
            |]
        """.trimMargin()
        mockServer.stubFor(
            WireMock.get(WireMock.urlPathMatching(".*/vc-json-list"))
                .willReturn(WireMock.jsonResponse(vcJsonListContent, 200))
        )

        mockServer.stubFor(
            WireMock.post(WireMock.urlPathMatching(".*/vp"))
                .willReturn(WireMock.jsonResponse("""{"vpAttribute": "vpValue"}""", 200))
        )

        val result = LinkedVpProvider.generateLinkedVp("vpID1")

        result shouldBe mapOf(
            "vpAttribute" to "vpValue"
        )

        val inputJson = """{
            | "keyName": "key",
            | "vpID": "vpID1",
            | "issuerID": "controller",
            | "verifiableCredential": {
            |  "credentialSubject": {
            |   "didDocument": {
            |    "verificationMethod": [{
            |     "controller": "controller"
            |    }]
            |   }
            |  },
            |  "proof": {
            |   "created": "2023-09-01T00:00:00+09:00"
            |  }
            | }
            |}
        """.trimMargin()
        mockServer.verify(
            WireMock.postRequestedFor(WireMock.urlMatching(".*/vp"))
                .withRequestBody(WireMock.equalToJson(inputJson))
        )
    }

    "現在日時を含む中で最も古いものを取る" {
        mockkObject(DateTimeProvider) {
            every {
                DateTimeProvider.offsetNow()
            } returns OffsetDateTime.of(2023, 9, 21, 0, 0, 0, 0, ZoneOffset.ofHours(9))

            val vcJsonListContent = """[
                |{
                |"credentialSubject": {
                | "didDocument": {
                |  "verificationMethod": [{
                |   "controller": "controller1"
                |  }]
                | }
                |},
                |"validFrom": "2023-08-01T00:00:00+09:00",
                |"validUntil": "2023-09-21T00:00:00+09:00",
                |"proof": {
                | "created": "2021-01-01T00:00:00+09:00"
                |}
                |},
                |{
                |"credentialSubject": {
                | "didDocument": {
                |  "verificationMethod": [{
                |   "controller": "controller2"
                |  }]
                | }
                |},
                |"validFrom": "2023-09-21T00:00:01+09:00",
                |"validUntil": "2024-09-21T00:00:00+09:00",
                |"proof": {
                | "created": "2021-01-02T00:00:00+09:00"
                |}
                |},
                |{
                |"credentialSubject": {
                | "didDocument": {
                |  "verificationMethod": [{
                |   "controller": "controller3"
                |  }]
                | }
                |},
                |"validFrom": "2023-08-01T00:00:00+09:00",
                |"validUntil": "2024-09-30T00:00:00+09:00",
                |"proof": {
                | "created": "2021-02-01T00:00:00+09:00"
                |}
                |},
                |{
                |"credentialSubject": {
                | "didDocument": {
                |  "verificationMethod": [{
                |   "controller": "controller4"
                |  }]
                | }
                |},
                |"validFrom": "2023-08-01T00:00:00+09:00",
                |"validUntil": "2024-09-30T00:00:00+09:00",
                |"proof": {
                | "created": "2021-01-01T00:00:00+09:00"
                |}
                |}
                |]
            """.trimMargin()
            mockServer.stubFor(
                WireMock.get(WireMock.urlPathMatching(".*/vc-json-list"))
                    .willReturn(WireMock.jsonResponse(vcJsonListContent, 200))
            )

            mockServer.stubFor(
                WireMock.post(WireMock.urlPathMatching(".*/vp"))
                    .willReturn(WireMock.jsonResponse("""{"vpAttribute": "vpValue"}""", 200))
            )

            val result = LinkedVpProvider.generateLinkedVp("vpID1")

            result shouldBe mapOf(
                "vpAttribute" to "vpValue"
            )

            val inputJson = """{
                | "keyName": "key",
                | "vpID": "vpID1",
                | "issuerID": "controller4",
                | "verifiableCredential": {
                |  "credentialSubject": {
                |   "didDocument": {
                |    "verificationMethod": [{
                |     "controller": "controller4"
                |    }]
                |   }
                |  },
                |  "validFrom": "2023-08-01T00:00:00+09:00",
                |  "validUntil": "2024-09-30T00:00:00+09:00",
                |  "proof": {
                |   "created": "2021-01-01T00:00:00+09:00"
                |  }
                | }
                |}
            """.trimMargin()
            mockServer.verify(
                WireMock.postRequestedFor(WireMock.urlMatching(".*/vp"))
                    .withRequestBody(WireMock.equalToJson(inputJson))
            )
        }
    }
})
