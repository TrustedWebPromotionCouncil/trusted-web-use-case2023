package com.ttw.api.shared

import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

object DateTimeProvider {
    fun utcNow(): LocalDateTime = LocalDateTime.now(ZoneOffset.UTC)
        .truncatedTo(ChronoUnit.SECONDS)

    fun offsetNow(): OffsetDateTime = OffsetDateTime.now().truncatedTo(ChronoUnit.SECONDS)

    private val dateTimeFormatter = DateTimeFormatter.ISO_DATE_TIME

    fun formatUtcToJstOffset(utc: LocalDateTime): String = utc.atOffset(ZoneOffset.UTC)
        .withOffsetSameInstant(ZoneOffset.ofHours(9))
        .format(dateTimeFormatter)
}
