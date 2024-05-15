package com.brp.flows

import co.paralleluniverse.fibers.Suspendable
import com.brp.contracts.VCJsonContract
import com.brp.data.CredentialSubject
import com.brp.data.DIDDocument
import com.brp.data.GoReqVC
import com.brp.data.VerificationMethod
import com.brp.helpers.CommonUtilities
import com.brp.helpers.ConstVariables
import com.brp.helpers.CordaUtility
import com.brp.states.VCJsonState
import net.corda.core.contracts.UniqueIdentifier
import net.corda.core.contracts.requireThat
import net.corda.core.flows.*
import net.corda.core.transactions.SignedTransaction
import net.corda.core.transactions.TransactionBuilder
import net.corda.core.utilities.ProgressTracker
import net.corda.core.utilities.unwrap
import java.util.*

@InitiatingFlow
@StartableByRPC
class VCJsonGenerationFlow(
    private val authOrgName: String,
    private val vcID: String,
    private val validityPeriod: Int // Can be up to 2,147,483,647 seconds. For example, 1 week = 7 * 60 * 60
) : FlowLogic<String>() {

    override val progressTracker: ProgressTracker = ProgressTracker()

    @Suspendable
    override fun call(): String {
        logger.info("VCJsonGenerationFlow started.")

        logger.info("Step01. AuthCompany looks up authOrg by its name.")
        val authOrg = serviceHub.identityService.partiesFromName(authOrgName, true).single()

        logger.info("Step02. AuthCompany gets KeyName and its Public Key from Golang API.")
        val keyName = getKeyName4AuthOrg()
        val publicKey = getPublicKey(keyName)
        logger.info("keyName: $keyName, publicKey: $publicKey")

        logger.info("Step03. AuthCompany prepares DID Document.")
        val did = getDID(ourIdentity.name.toString())
        val verificationMethod = VerificationMethod(
            "$did#$keyName",
            ConstVariables.VerificationMethodType,
            did,
            publicKey
        )

        val didDocument = DIDDocument(
            ConstVariables.DIDContext,
            did,
            mutableListOf(verificationMethod)
        )

        logger.info("Step04. AuthCompany sends validityPeriod, vcID and DID Document to AuthOrg.")
        val session = initiateFlow(authOrg)
        session.send(validityPeriod)
        session.send(vcID)
        session.send(didDocument)

        logger.info("Step10. AuthCompany receives VC Json from AuthOrg.")
        val vcJson = session.receive<String>().unwrap { it }

        logger.info("Final Step. AuthCompany creates VCJsonState via a TX.")
        val notary = CordaUtility.getNotary(serviceHub)
        val participants = listOf( authOrg , ourIdentity)
        val output = VCJsonState(
            ourIdentity,
            authOrg,
            vcID,
            vcJson,
            CommonUtilities.dateToStr(Date()),
            UniqueIdentifier(),
            participants)
        val builder = TransactionBuilder(notary)
            .addCommand(VCJsonContract.Commands.Create(), participants.map { it.owningKey })
            .addOutputState(output)
        builder.verify(serviceHub)
        val ptx = serviceHub.signInitialTransaction(builder)
        val stx = subFlow(CollectSignaturesFlow(ptx, listOf(session)))
        subFlow(FinalityFlow(stx, listOf(session)))

        return vcJson
    }
}


@InitiatedBy(VCJsonGenerationFlow::class)
class VCJsonGenerationFlowHandler(private val counterPartySession: FlowSession) : FlowLogic<Unit>() {
    @Suspendable
    override fun call() {

        logger.info("Step05. AuthOrg receives vcID and did document from AuthCompany.")
        val validityPeriod = counterPartySession.receive<Int>().unwrap { it }
        val vcID = counterPartySession.receive<String>().unwrap { it }
        val didDocument = counterPartySession.receive<DIDDocument>().unwrap { it }

        logger.info("Step06. AuthOrg gets KeyName and its Public Key from Golang API.")
        val keyName = getKeyName4AuthOrg()
        val publicKey = getPublicKey(keyName)
        logger.info("keyName: $keyName, publicKey: $publicKey")

        logger.info("Step07. AuthOrg creates VC state .")
        val (txID, uuid) = subFlow(VCRegistration())

        logger.info("Step08. AuthOrg gets VC from Golang API.")
        val did = getDID(ourIdentity.name.toString())
        val issuerName = getIssuerName(ourIdentity.name.toString())
        val validFrom = Date()

        val vcReq = GoReqVC(
            keyName,
            vcID,
            did,
            issuerName,
            CommonUtilities.dateToStr(validFrom),
            CommonUtilities.dateToStr(CommonUtilities.afterSeconds(validFrom,validityPeriod)),
            CredentialSubject(didDocument, txID, uuid)
        )

        val vcJson = getVC(vcReq)

        logger.info("Step09. AuthOrg sends VCJson back to AuthCompany.")
        counterPartySession.send(vcJson)


        logger.info("Final Step. AuthOrg creates VCJsonState via a TX.")

        val signTransactionFlow = object : SignTransactionFlow(counterPartySession) {
            override fun checkTransaction(stx: SignedTransaction) = requireThat {
            }
        }
        val txId = subFlow(signTransactionFlow).id
        subFlow(ReceiveFinalityFlow(counterPartySession, expectedTxId = txId))
    }
}
