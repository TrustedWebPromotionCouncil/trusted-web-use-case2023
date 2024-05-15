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
class VCRegistration() : FlowLogic<Pair<String, String>>() {
    companion object {
        val logger = loggerFor<VCJsonGenerationFlow>()
    }

    override val progressTracker = ProgressTracker()

    @Suspendable
    override fun call(): Pair<String, String> {
        logger.info("VCRegistration started.")

        val authCompany = serviceHub.myInfo.legalIdentities.first()
        val revocationMngCompanies=serviceHub.identityService
                                .partiesFromName(ConstVariables.RevocationMngCompanyNamePrefix, false)
                                .filter{ ConstVariables.RevocationMngCompanyNameRegex.matches(it.name.organisation) }

        if(revocationMngCompanies.isEmpty()){
            throw FlowException("No revocationMngCompany found.")
        }
        // Step 1. Get a reference to the notary service on our network and our key pair.
        val notary = CordaUtility.getNotary(serviceHub)

        //Step 2. Compose the State
        val participants = revocationMngCompanies + authCompany

        val output = VCState(
                authCompany,
                revocationMngCompanies,
                ConstVariables.VCValidStatus,
                CommonUtilities.dateToStr(Date()),
                UniqueIdentifier(),
                participants)

        //Step 3.  Create a new TransactionBuilder object.
        val builder = TransactionBuilder(notary)
                .addCommand(VCContract.Commands.Register(), participants.map { it.owningKey })
                .addOutputState(output)

        // Step 4. Verify and sign it with our KeyPair.
        builder.verify(serviceHub)

        // Step 5. Sign and finalize the TX.
        val ptx = serviceHub.signInitialTransaction(builder)
        val sessions = revocationMngCompanies.map{ initiateFlow(it) }

        val stx = subFlow(CollectSignaturesFlow(ptx, sessions))
        val tx = subFlow(FinalityFlow(stx, sessions))
        return Pair(tx.id.toString(), output.linearId.id.toString())
    }
}

@InitiatedBy(VCRegistration::class)
class VCRegistrationHandler(private val otherSession: FlowSession) : FlowLogic<Unit>() {
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
