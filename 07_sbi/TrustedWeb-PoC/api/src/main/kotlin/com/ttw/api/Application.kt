package com.ttw.api

import com.ttw.api.infrastructure.services.JsonSerializer
import com.ttw.api.jobs.configureJob
import com.ttw.api.routes.configureExceptionHandling
import com.ttw.api.routes.configureRouting
import io.ktor.server.application.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    val allConf = environment.config.toMap()["config"] as OriginalConfig

    // 設定値の取得
    Config.databaseUrl = allConf.getConf<Map<String, String>>("database")["url"]!!
    Config.authId = allConf.getConf("authId")
    Config.releaseVersion = allConf.getConf("releaseVersion")
    Config.digitalCertificateOrganization = allConf.getConf("digitalCertificateOrganization")
    Config.externalService = allConf.getConf("externalService")

    configureRouting()
    configureExceptionHandling()
    configureJob()
}

private typealias OriginalConfig = Map<*, *>

private inline fun <reified T> OriginalConfig.getConf(name: String): T = JsonSerializer.convert(get(name) as Map<*, *>)

object Config {
    lateinit var databaseUrl: String
    lateinit var authId: AuthIdConfig
    lateinit var releaseVersion: ReleaseVersionConfig
    lateinit var digitalCertificateOrganization: DigitalCertificateOrganizationConfig
    lateinit var externalService: ExternalServiceConfig
}

data class AuthIdConfig(
    val expirationSeconds: Long,
    val headerName: String,
)

data class ReleaseVersionConfig(
    val hash: String,
    val headerName: String,
)

data class DigitalCertificateOrganizationConfig(
    val id: String,
    val name: String,
    val credentialIssuer: String,
)

data class ExternalServiceConfig(
    val uuidUrl: String,
    val keyNameUrl: String,
    val vcJsonListUtl: String,
    val vpUrl: String,
    val vcUrl: String,
    val revocation_base_url: String,
    val revocation_endpoints: String,
)
