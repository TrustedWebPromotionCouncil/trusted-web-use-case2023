package com.ttw.api.usecases

import com.ttw.api.domains.AuthId
import com.ttw.api.exceptions.ErrorCode
import com.ttw.api.exceptions.UnauthorizedException
import com.ttw.api.infrastructure.repositories.AuthChallengeRepository
import com.ttw.api.infrastructure.services.JsonSerializer
import com.ttw.api.infrastructure.services.SignatureVerifier
import org.slf4j.LoggerFactory

object AuthenticateUseCase {

    private val logger = LoggerFactory.getLogger(javaClass)

    suspend fun handle(
        authId: AuthId,
        vc: Map<*, *>,
    ) {
        logger.debug("vc = {}", vc)

        // 認証IDとnonceが正しいかチェック
        val authChallenge = AuthChallengeRepository.fetchNotExpired(
            authId
        ) ?: throw UnauthorizedException(ErrorCode.UNAUTHORIZED, "有効期限のある認証IDが見つかりませんでした")

        // リクエストIDが見つかったら、使い回せないように削除
        AuthChallengeRepository.delete(authChallenge)

        val credentialSubject = try {
            getNested<Map<*, *>>(vc, "credentialSubject")
        } catch (e: Exception) {
            throw UnauthorizedException(ErrorCode.UNAUTHORIZED, "vcの中にcredentialSubjectがありません")
        }

        val challenge = credentialSubject["challenge"]
        if (challenge != authChallenge.challenge) {
            throw UnauthorizedException(ErrorCode.UNAUTHORIZED, "challengeの値が正しくありません")
        }

        // goと同じ項目の並びでJSON化する
        // issuerはid, nameの順
        val issuer = try {
            getNested<Map<*, *>>(vc, "issuer")
        } catch (e: Exception) {
            throw UnauthorizedException(ErrorCode.UNAUTHORIZED, "vcの中にissuerがありません")
        }
        val signedMessageMap = mapOf(
            "@context" to vc["@context"],
            "id" to vc["id"],
            "type" to vc["type"],
            "credentialSubject" to credentialSubject, // credentialSubjectは並び替えてはならない
            "issuer" to listOf("id", "name").associateWith { key -> issuer[key] },
            "validFrom" to vc["validFrom"],
            "validUntil" to vc["validUntil"],
        )

        val message = JsonSerializer.serialize(signedMessageMap)
        logger.debug("検証対象のメッセージ = {}", message)

        val publicKeyMultibase = try {
            val verificationMethod =
                getNested<List<Map<*, *>>>(credentialSubject, "didDocument", "verificationMethod")
            verificationMethod[0]["publicKeyMultibase"] as String
        } catch (e: Exception) {
            throw UnauthorizedException(ErrorCode.UNAUTHORIZED, "publicKeyMultibaseが見つかりません")
        }
        val signatureMultibase = try {
            getNested<String>(vc, "proof", "signatureValue")
        } catch (e: Exception) {
            throw UnauthorizedException(ErrorCode.UNAUTHORIZED, "signatureValueが見つかりません")
        }

        val verified = SignatureVerifier.verify(
            publicKeyMultibase = publicKeyMultibase,
            message = message,
            signatureMultibase = signatureMultibase,
        )

        if (!verified) {
            throw UnauthorizedException(ErrorCode.UNAUTHORIZED, "signatureValueが誤っています")
        }
    }

    private tailrec fun <T> getNested(map: Map<*, *>, firstKey: String, vararg restKeys: String): T {
        val firstValue = map[firstKey]

        return if (restKeys.isEmpty()) {
            @Suppress("UNCHECKED_CAST")
            firstValue as T
        } else {
            getNested(firstValue as Map<*, *>, restKeys.first(), *restKeys.drop(1).toTypedArray())
        }
    }
}
