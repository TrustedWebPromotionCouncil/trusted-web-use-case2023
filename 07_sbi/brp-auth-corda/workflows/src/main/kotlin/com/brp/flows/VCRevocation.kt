package com.brp.flows

import co.paralleluniverse.fibers.Suspendable
import com.brp.contracts.VCContract
import com.brp.helpers.CommonUtilities
import com.brp.helpers.ConstVariables
import com.brp.helpers.CordaUtility
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
class VCRevocation(
        private val linearId: String
) : FlowLogic<SignedTransaction>() {
    companion object {
        val logger = loggerFor<VCJsonGenerationFlow>()
    }

    override val progressTracker = ProgressTracker()

    @Suspendable
    override fun call(): SignedTransaction {
        logger.info("VCRevocation started. linearId: $linearId")

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

        val output = input.copy(
            status=ConstVariables.VCRevokedStatus,
            updatedTime = CommonUtilities.dateToStr(Date())
        )

        //Step 3.  Create a new TransactionBuilder object.
        val builder = TransactionBuilder(notary)
            .addInputState(stateAndRef)
            .addCommand(VCContract.Commands.Revoke(), output.participants.map{it.owningKey})
            .addOutputState(output)

        // Step 4. Verify and sign it with our KeyPair.
        builder.verify(serviceHub)

        // Step 5. Sign and finalize the TX.
        val ptx = serviceHub.signInitialTransaction(builder)
        val sessions = output.revocationMngCompanies.map{ initiateFlow(it) }

        val stx = subFlow(CollectSignaturesFlow(ptx, sessions))
        return subFlow(FinalityFlow(stx, sessions))
    }
}

@InitiatedBy(VCRevocation::class)
class VCRevocationHandler(private val otherSession: FlowSession) : FlowLogic<Unit>() {
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
