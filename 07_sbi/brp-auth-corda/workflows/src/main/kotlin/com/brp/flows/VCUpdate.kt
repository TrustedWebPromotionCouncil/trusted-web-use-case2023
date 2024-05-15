package com.brp.flows

import co.paralleluniverse.fibers.Suspendable
import com.brp.contracts.VCContract
import com.brp.helpers.CommonUtilities
import com.brp.helpers.ConstVariables
import com.brp.helpers.CordaUtility
import com.brp.states.VCState
import net.corda.core.contracts.UniqueIdentifier
import net.corda.core.contracts.requireThat
import net.corda.core.flows.*
import net.corda.core.transactions.SignedTransaction
import net.corda.core.transactions.TransactionBuilder
import net.corda.core.utilities.ProgressTracker
import net.corda.core.utilities.loggerFor
import java.util.*


// *********
// * Flows *
// *********
@InitiatingFlow
@StartableByRPC
class VCUpdate(
        private val linearId: String
) : FlowLogic<Pair<String, String>>() {
    companion object {
        val logger = loggerFor<VCJsonGenerationFlow>()
    }

    override val progressTracker = ProgressTracker()

    @Suspendable
    override fun call(): Pair<String, String> {
        logger.info("VCUpdate started. linearId: $linearId")

        val queriedStates = subFlow(QueryVCStateById(linearId))

        if (queriedStates.isEmpty())
            throw FlowException("businessUnitID($linearId) has not been found.")

        // Step 1. Get a reference to the notary service on our network and our key pair.
        val notary = CordaUtility.getNotary(serviceHub)

        //Step 2. Compose the State
        val stateAndRef = queriedStates.first()
        val input = stateAndRef.state.data

        // Check input status
        if ( input.status != ConstVariables.VCValidStatus )
            throw FlowException("Unexpected input status(${input.status}) has been detected.")

        // Check Company
        val self = serviceHub.myInfo.legalIdentities.first()
        if(self != input.authCompany){
            throw FlowException("VC registered by Company(${input.authCompany}) can not be revoked by $self .")
        }

        val currentTime =Date()

        val revokedVC = input.copy(
            status=ConstVariables.VCRevokedStatus,
            updatedTime = CommonUtilities.dateToStr(currentTime)
        )

        val newVC = VCState(
            revokedVC.authCompany,
            revokedVC.revocationMngCompanies,
            ConstVariables.VCValidStatus,
            CommonUtilities.dateToStr(currentTime),
            UniqueIdentifier(),
            revokedVC.participants)

        //Step 3.  Create a new TransactionBuilder object.
        val builder = TransactionBuilder(notary)
            .addInputState(stateAndRef)
            .addCommand(VCContract.Commands.Update(), newVC.participants.map{it.owningKey})
            .addOutputState(revokedVC)
            .addOutputState(newVC)

        // Step 4. Verify and sign it with our KeyPair.
        builder.verify(serviceHub)

        // Step 5. Sign and finalize the TX.
        val ptx = serviceHub.signInitialTransaction(builder)
        val sessions = newVC.revocationMngCompanies.map{ initiateFlow(it) }

        val stx = subFlow(CollectSignaturesFlow(ptx, sessions))
        val tx = subFlow(FinalityFlow(stx, sessions))

        return Pair(tx.id.toString(), newVC.linearId.id.toString())
    }
}

@InitiatedBy(VCUpdate::class)
class VCUpdateHandler(private val otherSession: FlowSession) : FlowLogic<Unit>() {
    @Suspendable
    override fun call() {
        val signTransactionFlow = object : SignTransactionFlow(otherSession) {
            override fun checkTransaction(stx: SignedTransaction) = requireThat {
            }
        }
        val txId = subFlow(signTransactionFlow).id
        subFlow(ReceiveFinalityFlow(otherSession, expectedTxId = txId))
    }
}
