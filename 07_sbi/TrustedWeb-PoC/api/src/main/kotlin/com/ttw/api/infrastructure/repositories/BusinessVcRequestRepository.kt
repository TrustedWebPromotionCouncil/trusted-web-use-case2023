package com.ttw.api.infrastructure.repositories

import com.ttw.api.domains.BusinessVcRequest
import com.ttw.api.domains.Organization
import com.ttw.api.domains.RequestId
import com.ttw.api.infrastructure.models.BusinessVcRequests
import com.ttw.api.infrastructure.shared.dbQuery
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.upsert

object BusinessVcRequestRepository {
    suspend fun store(businessVcRequest: BusinessVcRequest) {
        dbQuery {
            BusinessVcRequests.upsert(BusinessVcRequests.requestId) {
                it[requestId] = businessVcRequest.requestId.value
                it[organization] = businessVcRequest.organization.label
                it[uuid] = businessVcRequest.uuid
                it[receivedVc] = businessVcRequest.receivedVc
                it[linkedVp] = businessVcRequest.linkedVp
                it[signedVc] = businessVcRequest.signedVc
                it[createdAt] = businessVcRequest.createdDatetime
            }
        }
    }

    suspend fun fetch(requestId: RequestId): BusinessVcRequest? {
        return dbQuery {
            BusinessVcRequests.select {
                BusinessVcRequests.requestId.eq(requestId.value)
            }.firstOrNull()?.let {
                recordToEntity(it)
            }
        }
    }

    private fun recordToEntity(resultRow: ResultRow): BusinessVcRequest {
        return BusinessVcRequest(
            requestId = RequestId(resultRow[BusinessVcRequests.requestId]),
            organization = Organization.of(resultRow[BusinessVcRequests.organization])!!,
            uuid = resultRow[BusinessVcRequests.uuid],
            receivedVc = resultRow[BusinessVcRequests.receivedVc],
            linkedVp = resultRow[BusinessVcRequests.linkedVp],
            signedVc = resultRow[BusinessVcRequests.signedVc],
            createdDatetime = resultRow[BusinessVcRequests.createdAt],
        )
    }
}
