package com.ttw.api.routes

import com.ttw.api.Config
import com.ttw.api.exceptions.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*

fun Application.configureExceptionHandling() {
    install(StatusPages) {
        status(HttpStatusCode.NotFound, HttpStatusCode.MethodNotAllowed) { call, status ->
            call.application.log.info("Invalid path or method at {}, code = {}", call.request.uri, status)
            call.respondError(status, ErrorCode.PATH_OR_METHOD_NOT_FOUND, "パスまたはメソッドが誤っています")
        }

        exception<Throwable> { call, cause ->
            when (cause) {
                is NotFoundException -> {
                    call.application.log.info("Not found at ${call.request.uri}", cause)
                    call.respondError(HttpStatusCode.NotFound, cause)
                }

                is BadParameterException -> {
                    call.application.log.info("Bad parameter at ${call.request.uri}", cause)
                    call.respondError(HttpStatusCode.BadRequest, cause)
                }

                is UnauthorizedException -> {
                    call.application.log.info("Unauthorized at ${call.request.uri}", cause)
                    call.respondError(HttpStatusCode.Unauthorized, cause)
                }

                else -> {
                    call.application.log.error("Unexpected error at ${call.request.uri}", cause)
                    call.respondError(
                        HttpStatusCode.InternalServerError,
                        ErrorCode.UNEXPECTED_ERROR,
                        "予期せぬエラーが発生しました"
                    )
                }
            }
        }
    }
}

suspend fun ApplicationCall.respondError(
    status: HttpStatusCode,
    code: ErrorCode,
    message: String?
) {
    response.header(Config.releaseVersion.headerName, Config.releaseVersion.hash)
    respond(
        status = status,
        message = mapOf(
            "code" to code.codeValue,
            "message" to message,
        )
    )
}

suspend fun ApplicationCall.respondError(status: HttpStatusCode, e: ApiException) = respondError(
    status = status,
    code = e.code,
    message = e.message,
)
