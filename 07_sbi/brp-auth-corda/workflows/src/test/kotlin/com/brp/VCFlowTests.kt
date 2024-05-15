package com.brp

import com.brp.flows.QueryVCStateListByStatus
import com.brp.flows.VCRegistration
import com.brp.flows.VCRevocation
import com.brp.flows.VCUpdate
import com.brp.helpers.ConstVariables
import com.brp.helpers.CordaUtility
import com.brp.states.VCState
import net.corda.core.concurrent.CordaFuture
import net.corda.core.contracts.ContractState
import net.corda.core.contracts.StateAndRef
import net.corda.core.node.services.Vault.StateStatus
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.transactions.SignedTransaction
import net.corda.core.utilities.getOrThrow
import net.corda.testing.node.MockNetwork
import net.corda.testing.node.MockNetworkParameters
import net.corda.testing.node.StartedMockNode
import net.corda.testing.node.TestCordapp
import org.apache.logging.log4j.Level
import org.apache.logging.log4j.core.config.Configurator
import org.junit.After
import org.junit.Before
import org.junit.Test

class VCFlowTests {
    private lateinit var network: MockNetwork
    private lateinit var authNode: StartedMockNode
    private lateinit var revocationMngNodes: List<StartedMockNode>

//    private val authCompanyName = "OU=AuthDept, O=VCAuthCom1, L=Tokyo, C=JP"
//    private val revocationMngCompanyName1 = "OU=AuthDept, O=VCAuthOrgConsortium000001, L=Tokyo, C=JP"
//    private val revocationMngCompanyName2 = "OU=AuthDept, O=VCAuthOrgConsortium000002, L=Tokyo, C=JP"
//    private val revocationMngCompanyName3 = "OU=AuthDept, O=VCAuthOrgConsortium000003, L=Tokyo, C=JP"
//    private val revocationMngCompanyName4 = "OU=AuthDept, O=VCAuthOrgConsortium000004, L=Tokyo, C=JP"

    private val authCompanyName = "OU=AuthDept, O=VCAuthCom1, L=Taipei, C=TW"
    private val revocationMngCompanyName1 = "OU=AuthDept, O=VCAuthOrgConsortium000001, L=Taipei, C=TW"
    private val revocationMngCompanyName2 = "OU=AuthDept, O=VCAuthOrgConsortium000002, L=Taipei, C=TW"
    private val revocationMngCompanyName3 = "OU=AuthDept, O=VCAuthOrgConsortium000003, L=Taipei, C=TW"
    private val revocationMngCompanyName4 = "OU=AuthDept, O=VCAuthOrgConsortium000004, L=Taipei, C=TW"


    @Before
    fun setup() {
        Configurator.setAllLevels("", Level.ERROR)

        network = MockNetwork(MockNetworkParameters(cordappsForAllNodes = listOf(
            TestCordapp.findCordapp("com.brp.contracts"),
            TestCordapp.findCordapp("com.brp.flows")
        )))
        authNode = network.createPartyNode(CordaUtility.strToX500Name(authCompanyName))
        revocationMngNodes = listOf(
            network.createPartyNode(CordaUtility.strToX500Name(revocationMngCompanyName1)),
            network.createPartyNode(CordaUtility.strToX500Name(revocationMngCompanyName2)),
            network.createPartyNode(CordaUtility.strToX500Name(revocationMngCompanyName3)),
            network.createPartyNode(CordaUtility.strToX500Name(revocationMngCompanyName4)))

        network.runNetwork()
    }

    @After
    fun tearDown() {
        network.stopNodes()
    }
    @Test
    fun test() {
        println("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
        printAllNodes()
        printAllStates()

        println("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
        val linearId = registerVC()
        printAllStates()

        println("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
        revokeVC(linearId)
        printAllStates()

        println("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
        updateVC()
        printAllStates()

        println("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
        queryByStatus()
    }



    private fun printAllStates(){
        println("printAllStates:")

        (revocationMngNodes + authNode ).forEach { node ->
            println("##################################")
            println("Node: ${node.info.legalIdentitiesAndCerts.first().name}")
            val inputCriteria: QueryCriteria = QueryCriteria.VaultQueryCriteria().withStatus(StateStatus.UNCONSUMED)
            node.services.vaultService.queryBy(ContractState::class.java, inputCriteria).states
                .map { it.state }
                .forEach { println("------ $it") }

        }
    }

    private fun printAllNodes(){
        println("printAllNodes:")
        (revocationMngNodes + authNode ).forEach {
            println(CordaUtility.x500NameToStr(it.info.legalIdentitiesAndCerts.first().name))
        }
    }

    private fun registerVC(): String {
        println("registerVC()")

        val flow = VCRegistration()
        val future1: CordaFuture<Pair<String,String>> = authNode.startFlow(flow)

        network.runNetwork()

        val res = future1.getOrThrow()
        println("registerVC(). res: $res")

        return res.second
    }

    private fun revokeVC(linearId: String) {
        println("revokeVC()")

        val flow = VCRevocation(
                linearId
        )
        val future1: CordaFuture<SignedTransaction> = authNode.startFlow(flow)

        network.runNetwork()
        future1.getOrThrow()
    }

    private fun updateVC() {
        println("updateVC()")

        val flow = VCUpdate(
            registerVC()
        )
        val future1: CordaFuture<Pair<String,String>> = authNode.startFlow(flow)

        network.runNetwork()

        val res = future1.getOrThrow()
        println("updateVC(). res: $res")
    }

    private fun queryByStatus() {

        for (i in 1..201) {
            registerVC()
        }

        println("queryByStatus")

        val flow1 = QueryVCStateListByStatus(ConstVariables.VCValidStatus)
        val future1: CordaFuture<List<StateAndRef<VCState>>> = authNode.startFlow(flow1)

        val flow2 = QueryVCStateListByStatus(ConstVariables.VCRevokedStatus)
        val future2: CordaFuture<List<StateAndRef<VCState>>> = authNode.startFlow(flow2)

        network.runNetwork()

        val res1 = future1.getOrThrow()
        println("VCValidStatus: " + res1.size)

        val res2 = future2.getOrThrow()
        println("VCRevokedStatus:")
        res2.forEach { println(it.state.data) }
    }

}