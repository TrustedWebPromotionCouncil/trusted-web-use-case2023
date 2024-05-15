package com.ttw.api.infrastructure.services

import com.fasterxml.jackson.databind.DeserializationFeature
import com.ttw.api.Config
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.serialization.jackson.*

object HttpClientUtils {

    val httpClient = HttpClient(CIO) {
        expectSuccess = true
        install(Logging)
        install(ContentNegotiation) {
            jackson {
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            }
        }
    }

    private var keyName: String? = null
    suspend fun keyName(): String {
        data class GoKeyNameResponse(
            val keyName: String
        )

        if (keyName == null) {
            keyName = httpClient.get(Config.externalService.keyNameUrl)
                .body<GoKeyNameResponse>()
                .keyName
        }

        return keyName!!
    }
}
