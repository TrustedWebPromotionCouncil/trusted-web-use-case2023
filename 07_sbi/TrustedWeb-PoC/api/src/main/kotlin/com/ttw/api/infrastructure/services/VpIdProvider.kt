package com.ttw.api.infrastructure.services

import com.ttw.api.infrastructure.shared.dbQuery
import org.jetbrains.exposed.sql.statements.StatementType

object VpIdProvider {

    suspend fun issueVpId(): String {
        val seqNextVal = dbQuery {
            exec(stmt = "SELECT NEXTVAL('business_vc_vpid');", explicitStatementType = StatementType.SELECT) {
                it.next()
                it.getLong(1)
            }
        }

        return "vpID$seqNextVal"
    }
}
