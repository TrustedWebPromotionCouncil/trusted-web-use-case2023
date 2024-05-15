package com.ttw.api.infrastructure.services

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.ttw.api.Config
import com.ttw.api.shared.DateTimeProvider
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import org.slf4j.LoggerFactory
import java.time.OffsetDateTime

object LinkedVpProvider {

    private val logger = LoggerFactory.getLogger(javaClass)

    suspend fun generateLinkedVp(vpId: String): Map<*, *>? {
        // VCの中で一番古いものを取得する
        val now = DateTimeProvider.offsetNow()

        return with(HttpClientUtils) {
            val (rowVc, omittedVc) = httpClient.get(Config.externalService.vcJsonListUtl)
                .body<List<Map<*, *>>>()
                .asSequence()
                .map { it to JsonSerializer.convert<CordaVcJsonResponse>(it) }
                .filter { (_, omittedVc) ->
                    val validFrom = toOffsetDateTime(omittedVc.validFrom)
                    val validUntil = toOffsetDateTime(omittedVc.validUntil)

                    (validFrom == null || now >= validFrom) &&
                        (validUntil == null || now < validUntil)
                }
                .minByOrNull { (_, omittedVc) ->
                    // 発行日時の最も古いものを採用する
                    OffsetDateTime.parse(omittedVc.proof.created)
                } ?: return null

            httpClient.post(Config.externalService.vpUrl) {
                contentType(ContentType.Application.Json)
                setBody(
                    GoVpRequest(
                        keyName = keyName(),
                        vpID = vpId,
                        issuerID = omittedVc.credentialSubject.didDocument.verificationMethod[0].controller,
                        verifiableCredential = rowVc,
                    )
                )
            }.body<Map<*, *>>().also {
                logger.debug("linked VP = {}", it)
            }
        }
    }

    private fun toOffsetDateTime(dateTimeString: String?): OffsetDateTime? = dateTimeString?.let {
        OffsetDateTime.parse(it)
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
private data class CordaVcJsonResponse(
    val credentialSubject: CredentialSubject,
    val validFrom: String?,
    val validUntil: String?,
    val proof: Proof,
)

@JsonIgnoreProperties(ignoreUnknown = true)
private data class CredentialSubject(
    val didDocument: DidDocument,
)

@JsonIgnoreProperties(ignoreUnknown = true)
private data class DidDocument(
    val verificationMethod: List<VerificationMethod>
)

@JsonIgnoreProperties(ignoreUnknown = true)
private data class VerificationMethod(
    val controller: String,
)

@JsonIgnoreProperties(ignoreUnknown = true)
private data class Proof(
    val created: String,
)

private data class GoVpRequest(
    val keyName: String,
    val vpID: String,
    val issuerID: String,
    val verifiableCredential: Map<*, *>
)
