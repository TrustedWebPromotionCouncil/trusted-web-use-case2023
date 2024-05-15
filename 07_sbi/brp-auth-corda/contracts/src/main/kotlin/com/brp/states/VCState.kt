package com.brp.states

import com.brp.contracts.VCContract
import com.brp.helpers.CommonUtilities
import com.brp.schema.VCSchemaV1
import net.corda.core.contracts.BelongsToContract
import net.corda.core.contracts.LinearState
import net.corda.core.contracts.UniqueIdentifier
import net.corda.core.identity.AbstractParty
import net.corda.core.identity.Party
import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState
import net.corda.core.schemas.QueryableState
import java.util.*
// *********
// * State *
// *********
@BelongsToContract(VCContract::class)
data class VCState(
    val authCompany: Party,
    val revocationMngCompanies: List<Party>,
    val status: String,
    val updatedTime: String = CommonUtilities.dateToStr(Date()),
    override val linearId: UniqueIdentifier = UniqueIdentifier(),
    override val participants: List<AbstractParty> = revocationMngCompanies + authCompany
) : LinearState, QueryableState {
    override fun generateMappedObject(schema: MappedSchema): PersistentState {
        return when (schema) {
            is VCSchemaV1 -> VCSchemaV1.PersistentVC(
                this.authCompany.toString(),
                this.status.toString(),
                CommonUtilities.strToDate(this.updatedTime)!!,
                this.linearId.id.toString()
            )
            else -> throw IllegalArgumentException("Unrecognised schema $schema")
        }
    }
    override fun supportedSchemas(): Iterable<MappedSchema> = listOf(VCSchemaV1)
}





