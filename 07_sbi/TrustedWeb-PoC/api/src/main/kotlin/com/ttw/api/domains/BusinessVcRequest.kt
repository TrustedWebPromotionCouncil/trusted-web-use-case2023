package com.ttw.api.domains

import com.ttw.api.domains.shared.Id
import java.time.LocalDateTime

data class BusinessVcRequest(
    val requestId: RequestId,
    val organization: Organization,
    val uuid: String,
    val receivedVc: Map<*, *>,
    val linkedVp: Map<*, *>,
    val signedVc: Map<*, *>?,
    val createdDatetime: LocalDateTime,
) {
    companion object {
        fun create(
            organization: Organization,
            uuid: String,
            receivedVc: Map<*, *>,
            linkedVp: Map<*, *>,
            signedVc: Map<*, *>?,
            createdDatetime: LocalDateTime,
        ): BusinessVcRequest = BusinessVcRequest(
            requestId = RequestId.generate(),
            organization = organization,
            uuid = uuid,
            receivedVc = receivedVc,
            linkedVp = linkedVp,
            signedVc = signedVc,
            createdDatetime = createdDatetime,
        )
    }
}

class RequestId(value: String) : Id(value) {
    companion object {
        fun generate(): RequestId = RequestId(generateIdValue())
    }
}
