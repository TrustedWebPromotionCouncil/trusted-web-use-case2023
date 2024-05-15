package com.ttw.api.domains

import com.ttw.api.Config
import com.ttw.api.domains.shared.Id
import com.ttw.api.shared.DateTimeProvider
import java.time.LocalDateTime
import java.util.*

data class AuthChallenge(
    val authId: AuthId,
    val challenge: String,
    val expiredDatetime: LocalDateTime
) {
    companion object {
        fun create(): AuthChallenge = AuthChallenge(
            authId = AuthId.generate(),
            challenge = UUID.randomUUID().toString(),
            expiredDatetime = DateTimeProvider.utcNow().plusSeconds(
                Config.authId.expirationSeconds
            ),
        )
    }
}

class AuthId(value: String) : Id(value) {
    companion object {
        fun generate(): AuthId = AuthId(generateIdValue())
    }
}
