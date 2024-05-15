package com.ttw.api.infrastructure.services

import com.ttw.api.Config
import com.ttw.api.shared.DateTimeProvider
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import org.slf4j.LoggerFactory
import java.time.LocalDateTime

object SignedVcProvider {

    private val logger = LoggerFactory.getLogger(javaClass)

    suspend fun generateSignedVc(
        vcId: String,
        issuerId: String,
        issuerName: String,
        validFrom: LocalDateTime,
        validUntil: LocalDateTime,
        credentialSubject: Map<*, *>,
    ): Map<*, *> {
        return with(HttpClientUtils) {
            httpClient.post(Config.externalService.vcUrl) {
                contentType(ContentType.Application.Json)
                setBody(
                    GoVcRequest(
                        keyName = keyName(),
                        vcID = vcId,
                        issuerId = issuerId,
                        issuerName = issuerName,
                        validFrom = DateTimeProvider.formatUtcToJstOffset(validFrom),
                        validUntil = DateTimeProvider.formatUtcToJstOffset(validUntil),
                        credentialSubject = credentialSubject,
                    )
                )
            }.body<Map<*, *>>().also {
                logger.debug("signed vc = {}", it)
            }
        }
    }
}

private data class GoVcRequest(
    val keyName: String,
    val vcID: String,
    val issuerId: String,
    val issuerName: String,
    val validFrom: String,
    val validUntil: String,
    val credentialSubject: Map<*, *>,
)
