package com.ttw.api.infrastructure.services

import com.ttw.api.Config
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.serialization.jackson.*
import org.slf4j.LoggerFactory

object VcStatusProvider {

    private val logger = LoggerFactory.getLogger(javaClass)

    private val httpClient = HttpClient(CIO) {
        expectSuccess = true
        install(Logging)
        install(ContentNegotiation) {
            jackson()
        }
    }

    // Corda endpoint : GET /brp/corda/revocation/vc-status/:uuid
    suspend fun getStatusByUuid(uuid: String): String {
        val status = httpClient.get(Config.externalService.revocation_base_url + "/vc-status/" + uuid)
            .body<CordaStatusResponse>()
            .status

        logger.info("uuid=$uuid status(corda)=$status")

        return if (status != "Valid") {
            "Invalid"
        } else {
            status
        }
    }

    private data class CordaStatusResponse(
        val status: String
    )
}
