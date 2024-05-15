package com.brp.states

import com.brp.contracts.VCJsonContract
import com.brp.helpers.CommonUtilities
import net.corda.core.contracts.BelongsToContract
import net.corda.core.contracts.LinearState
import net.corda.core.contracts.UniqueIdentifier
import net.corda.core.identity.AbstractParty
import net.corda.core.identity.Party
import java.util.*

// *********
// * State *
// *********
@BelongsToContract(VCJsonContract::class)
data class VCJsonState(
    val authCompany: Party,
    val authOrg: Party,
    val vcID: String,
    val vcJson: String,
    val updatedTime: String = CommonUtilities.dateToStr(Date()),
    override val linearId: UniqueIdentifier = UniqueIdentifier(),
    override val participants: List<AbstractParty> = listOf( authOrg , authCompany)
) : LinearState {}





