package com.ttw.api.infrastructure.services

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue

object JsonSerializer {

    val objectMapper: ObjectMapper = jacksonObjectMapper().registerModule(JavaTimeModule())

    fun serialize(target: Any): String {
        return objectMapper.writeValueAsString(target)
    }

    inline fun <reified T> deserialize(string: String): T {
        return objectMapper.readValue<T>(string)
    }

    inline fun <reified T> convert(target: Any): T {
        return objectMapper.convertValue(target)
    }
}
