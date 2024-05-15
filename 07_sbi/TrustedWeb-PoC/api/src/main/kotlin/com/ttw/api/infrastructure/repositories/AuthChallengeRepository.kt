package com.ttw.api.infrastructure.repositories

import com.ttw.api.domains.AuthChallenge
import com.ttw.api.domains.AuthId
import com.ttw.api.infrastructure.models.AuthChallenges
import com.ttw.api.infrastructure.shared.dbQuery
import com.ttw.api.shared.DateTimeProvider
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.lessEq

object AuthChallengeRepository {
    suspend fun store(authChallenge: AuthChallenge) {
        dbQuery {
            AuthChallenges.upsert(AuthChallenges.authId) {
                it[authId] = authChallenge.authId.value
                it[challenge] = authChallenge.challenge
                it[expiredAt] = authChallenge.expiredDatetime
            }
        }
    }

    suspend fun fetchNotExpired(authId: AuthId): AuthChallenge? {
        val now = DateTimeProvider.utcNow()

        return dbQuery {
            AuthChallenges.select {
                AuthChallenges.authId.eq(authId.value) and
                    AuthChallenges.expiredAt.greater(now)
            }.firstOrNull()?.let {
                recordToEntity(it)
            }
        }
    }

    suspend fun delete(authChallenge: AuthChallenge) {
        dbQuery {
            AuthChallenges.deleteWhere {
                authId.eq(authChallenge.authId.value)
            }
        }
    }

    suspend fun deleteExpired() {
        val now = DateTimeProvider.utcNow()

        dbQuery {
            AuthChallenges.deleteWhere {
                expiredAt.lessEq(now)
            }
        }
    }

    private fun recordToEntity(resultRow: ResultRow): AuthChallenge {
        return AuthChallenge(
            authId = AuthId(resultRow[AuthChallenges.authId]),
            challenge = resultRow[AuthChallenges.challenge],
            expiredDatetime = resultRow[AuthChallenges.expiredAt],
        )
    }
}
