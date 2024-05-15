package com.ttw.api.routes

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ttw.api.Config
import com.ttw.api.domains.AuthId
import com.ttw.api.domains.Organization
import com.ttw.api.exceptions.BadParameterException
import com.ttw.api.exceptions.ErrorCode
import com.ttw.api.exceptions.UnauthorizedException
import com.ttw.api.usecases.AuthenticateUseCase
import com.ttw.api.usecases.GetChallengeUseCase
import com.ttw.api.usecases.GetVcStatusUseCase
import com.ttw.api.usecases.RegisterVcRequestUseCase
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.autohead.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.*

fun Application.configureRouting() {
    install(AutoHeadResponse)
    install(ContentNegotiation) {
        jackson {
            registerModule(JavaTimeModule())
        }
    }

    routing {
        // Deprecated: {orgName}が入っている方を使ってください
        get("/challenge") {
            call.respondWithReleaseVersion(
                GetChallengeUseCase.handle()
            )
        }

        get("/{orgName}/challenge") {
            // orgNameは使わない。チェックだけする
            call.organization()
            call.respondWithReleaseVersion(
                GetChallengeUseCase.handle()
            )
        }

        post("/{orgName}/vc-requests") {
            val request = call.authAndReceive<Map<*, *>>()
            val organization = call.organization()

            call.respondWithReleaseVersion(
                RegisterVcRequestUseCase.handle(
                    rawVc = request,
                    organization = organization,
                )
            )
        }

        get("/{orgName}/vc-status/{uuid}") {
            val uuidString = call.parameters["uuid"]!!
            val organization = call.organization()

            call.respondWithReleaseVersion(
                GetVcStatusUseCase.handle(
                    uuid = uuidString,
                    organization = organization,
                )
            )
        }

        get("/health") {
            call.respondWithReleaseVersion(mapOf("status" to "ok"))
        }

        get("/commit-id") {
            val commitId = try {
                val props = Properties().also {
                    javaClass.classLoader.getResourceAsStream("git.properties").use { stream ->
                        it.load(stream)
                    }
                }

                props.getProperty("git.commit.id.abbrev")
            } catch (e: Exception) {
                call.application.log.error("コミットIDの取得でエラーが発生しました", e)
                null
            }

            call.respondWithReleaseVersion(mapOf("commitId" to commitId))
        }
    }
}

private suspend inline fun <reified T : Any> ApplicationCall.respondWithReleaseVersion(message: T) {
    response.header(Config.releaseVersion.headerName, Config.releaseVersion.hash)
    respond(message)
}

private suspend inline fun <reified T> ApplicationCall.authAndReceive(): T {
    var result: T? = null

    auth {
        result = if (it is T) {
            it
        } else {
            val objectMapper = jacksonObjectMapper().registerModule(JavaTimeModule())
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            try {
                objectMapper.convertValue<T>(it)
            } catch (e: Exception) {
                throw BadParameterException(
                    code = ErrorCode.BAD_PARAMETER,
                    message = "リクエストボディのフォーマットが不正です",
                    cause = e,
                )
            }
        }
    }

    return result!!
}

private suspend fun ApplicationCall.auth(callback: (Map<*, *>) -> Unit = {}) {
    val authId = request.header(Config.authId.headerName)?.let {
        AuthId(it)
    } ?: throw UnauthorizedException(ErrorCode.UNAUTHORIZED, "リクエストIDがヘッダにありません")

    val vc = try {
        receive<Map<*, *>>()
    } catch (e: Exception) {
        throw UnauthorizedException(
            code = ErrorCode.UNAUTHORIZED,
            message = "リクエストボディのフォーマットが不正です",
            cause = e,
        )
    }

    AuthenticateUseCase.handle(
        authId = authId,
        vc = vc
    )

    callback(vc)
}

private fun ApplicationCall.organization(): Organization {
    val orgNameString = parameters["orgName"]
    return orgNameString?.let {
        Organization.of(it)
    } ?: throw BadParameterException(
        code = ErrorCode.BAD_PARAMETER,
        message = "組織名 $orgNameString は受け付けられません"
    )
}
