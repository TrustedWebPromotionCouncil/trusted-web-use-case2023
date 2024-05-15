package com.ttw.api.exceptions

enum class ErrorCode(val codeValue: String) {
    UNEXPECTED_ERROR("E0000"),
    BAD_PARAMETER("E0001"),
    UNAUTHORIZED("E0002"),
    PATH_OR_METHOD_NOT_FOUND("E0003"),
    REQUEST_ID_NOT_FOUND("E0004"),
}
