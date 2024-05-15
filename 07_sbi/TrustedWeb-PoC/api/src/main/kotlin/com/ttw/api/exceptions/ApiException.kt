package com.ttw.api.exceptions

sealed class ApiException(val code: ErrorCode, message: String?, cause: Throwable?) : RuntimeException(message, cause)

class NotFoundException(code: ErrorCode, message: String?, cause: Throwable? = null) :
    ApiException(code, message, cause)

class BadParameterException(code: ErrorCode, message: String?, cause: Throwable? = null) :
    ApiException(code, message, cause)

class UnauthorizedException(code: ErrorCode, message: String?, cause: Throwable? = null) :
    ApiException(code, message, cause)
