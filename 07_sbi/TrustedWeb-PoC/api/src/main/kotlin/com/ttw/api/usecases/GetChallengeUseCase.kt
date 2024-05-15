package com.ttw.api.usecases

import com.ttw.api.domains.AuthChallenge
import com.ttw.api.infrastructure.repositories.AuthChallengeRepository
import java.time.ZoneOffset

object GetChallengeUseCase {
    suspend fun handle(): ChallengeDto {
        val authChallenge = AuthChallenge.create()
        AuthChallengeRepository.store(authChallenge)

        return ChallengeDto(
            authId = authChallenge.authId.value,
            challenge = authChallenge.challenge,
            exp = authChallenge.expiredDatetime.toEpochSecond(ZoneOffset.UTC)
        )
    }
}

data class ChallengeDto(
    val authId: String,
    val challenge: String,
    val exp: Long,
)
