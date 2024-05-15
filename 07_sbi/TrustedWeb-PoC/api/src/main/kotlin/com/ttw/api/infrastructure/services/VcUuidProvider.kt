package com.ttw.api.infrastructure.services

import com.ttw.api.Config
import io.ktor.client.call.*
import io.ktor.client.request.*

object VcUuidProvider {

    suspend fun issueUuid(): String {
        return with(HttpClientUtils) {
            // CordaにUUIDを取りに行く
            httpClient.post(Config.externalService.uuidUrl)
                .body<CordaUuidResponse>()
                .uuid
        }
    }

    private data class CordaUuidResponse(
        val blockHash: String,
        val uuid: String,
    )
}
