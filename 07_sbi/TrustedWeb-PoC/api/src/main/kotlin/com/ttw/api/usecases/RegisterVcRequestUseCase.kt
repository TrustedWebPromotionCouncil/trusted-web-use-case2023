package com.ttw.api.usecases

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.ttw.api.Config
import com.ttw.api.domains.BusinessVcRequest
import com.ttw.api.domains.Organization
import com.ttw.api.exceptions.BadParameterException
import com.ttw.api.exceptions.ErrorCode
import com.ttw.api.infrastructure.repositories.BusinessVcRequestRepository
import com.ttw.api.infrastructure.services.*
import com.ttw.api.shared.DateTimeProvider

object RegisterVcRequestUseCase {
    suspend fun handle(
        rawVc: Map<*, *>,
        organization: Organization,
    ): VcRequestOutput {
        // 受け取ったVCを使いやすい形に変えておく
        val receivedVc = try {
            JsonSerializer.convert<ReceivedVc>(rawVc)
        } catch (e: Exception) {
            throw BadParameterException(
                ErrorCode.BAD_PARAMETER,
                "VCのフォーマットが正しくありません",
                e,
            )
        }

        // Cordaにuuidを取得に行く
        val uuid = VcUuidProvider.issueUuid()

        // VPを発行する
        val vpId = VpIdProvider.issueVpId()
        // Cordaに1件もVCがない場合は考慮不要かもしれないが、
        // 一応ない場合はサンプルを入れる
        val linkedVp = LinkedVpProvider.generateLinkedVp(vpId)
            ?: sampleLinkedVpValue

        val validFrom = DateTimeProvider.utcNow()

        val endpointsList: List<String> = Config.externalService.revocation_endpoints
            ?.split(",")
            ?.map { it.trim() }
            ?: emptyList()

        val signedVc = SignedVcProvider.generateSignedVc(
            vcId = receivedVc.id,
            issuerId = linkedVp["holder"] as? String
                ?: throw RuntimeException("Linked VPの値が想定外です: ${linkedVp["holder"]}"),
            issuerName = Config.digitalCertificateOrganization.name,
            validFrom = validFrom,
            validUntil = validFrom.plusYears(1L), // 有効期間は1年間と仮で置いておく
            credentialSubject = mapOf(
                "didDocument" to receivedVc.credentialSubject.didDocument,
                "authenticatorInfo" to mapOf(
                    "digitalCertificateOrganizationName" to Config.digitalCertificateOrganization.name,
                    "digitalCertificateOrganizationCredentialIssuer" to Config.digitalCertificateOrganization.credentialIssuer,
                ),
                "businessUnitInfo" to receivedVc.credentialSubject.businessUnitInfo,
                "legalEntityInfo" to receivedVc.credentialSubject.legalEntityInfo,
                "authenticationLevel" to receivedVc.credentialSubject.authenticationLevel,
                "revocationEndPoints" to endpointsList,
                "linkedVP" to linkedVp,
                "uuid" to uuid,
            )
        )

        val businessVcRequest = BusinessVcRequest.create(
            organization = organization,
            uuid = uuid,
            receivedVc = rawVc,
            linkedVp = linkedVp,
            signedVc = signedVc,
            createdDatetime = validFrom,
        )
        BusinessVcRequestRepository.store(businessVcRequest)

        return VcRequestOutput(
            requestId = businessVcRequest.requestId.value,
            status = CertificationResult.Approved,
            vc = signedVc,
        )
    }

    // サンプルのLinkedVP
    private val sampleLinkedVpValue by lazy {
        javaClass.getResource("/sample_linked_vp.json")!!
            .readText()
            .let { JsonSerializer.deserialize<Map<*, *>>(it) }
    }
}

data class VcRequestOutput(
    val requestId: String,
    val status: CertificationResult,
    val vc: Map<*, *>
)

enum class CertificationResult {
    Approved,
    Rejected,
}

@JsonIgnoreProperties(ignoreUnknown = true)
private data class ReceivedVc(
    val id: String,
    val credentialSubject: ReceivedVcCredentialSubject,
)

@JsonIgnoreProperties(ignoreUnknown = true)
private data class ReceivedVcCredentialSubject(
    val didDocument: Any,
    val businessUnitInfo: BusinessUnitInfo,
    val legalEntityInfo: LegalEntityInfo,
    val authenticationLevel: String,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
private data class ContactInfo(
    val name: String,
    val department: String,
    val jobTitle: String,
    val contactNumber: String,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
private data class BusinessUnitInfo(
    val businessUnitName: String,
    val country: String,
    val address: String?,
    val contactInfo: ContactInfo?,
)

private data class LegalEntityInfo(
    val legalEntityIdentifier: String,
    val legalEntityName: String,
    val location: String,
)
