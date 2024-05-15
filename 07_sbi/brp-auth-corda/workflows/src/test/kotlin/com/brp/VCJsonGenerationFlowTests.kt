package com.brp

import com.brp.flows.QueryVCJsonStates
import com.brp.flows.VCJsonGenerationFlow
import com.brp.helpers.CordaUtility
import com.brp.states.VCJsonState
import net.corda.core.concurrent.CordaFuture
import net.corda.core.contracts.ContractState
import net.corda.core.contracts.StateAndRef
import net.corda.core.node.services.Vault
import net.corda.core.node.services.vault.QueryCriteria
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

class VCJsonGenerationFlowTests {
    private lateinit var network: MockNetwork
    private lateinit var authOrgNode: StartedMockNode
    private lateinit var authCompanyNode: StartedMockNode
    private lateinit var revocationMngNodes: List<StartedMockNode>

//    private val authOrgName = "OU=AuthDept, O=VCAuthOrg, L=Tokyo, C=JP"
//    private val authCompanyName = "OU=AuthDept, O=VCAuthCom1, L=Tokyo, C=JP"
//    private val revocationMngCompanyName1 = "OU=AuthDept, O=VCAuthOrgConsortium000001, L=Tokyo, C=JP"
//    private val revocationMngCompanyName2 = "OU=AuthDept, O=VCAuthOrgConsortium000002, L=Tokyo, C=JP"
//    private val revocationMngCompanyName3 = "OU=AuthDept, O=VCAuthOrgConsortium000003, L=Tokyo, C=JP"
//    private val revocationMngCompanyName4 = "OU=AuthDept, O=VCAuthOrgConsortium000004, L=Tokyo, C=JP"

    private val authOrgName = "OU=AuthDept, O=VCAuthOrg, L=Taipei, C=TW"
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
        authOrgNode = network.createPartyNode(CordaUtility.strToX500Name(authOrgName))
        authCompanyNode = network.createPartyNode(CordaUtility.strToX500Name(authCompanyName))
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
    fun test(){
        println("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
        testVCJsonGenerationFlow("vcID0003")
        testVCJsonGenerationFlow("vcID0001")
        testVCJsonGenerationFlow("vcID0002")
        printAllStates()

        println("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
        queryStatus()

        println("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
        testVCJsonGenerationFlow2("vcID0004")
        printAllStates()
    }

    fun testVCJsonGenerationFlow(vcID: String) {
        // The flow should return the first commit of the BitCoin readme.
        val flow = VCJsonGenerationFlow("VCAuthOrg", vcID, 7 * 60 * 60)
        val future = authCompanyNode.startFlow(flow)
        network.runNetwork()
        val vcJson = future.getOrThrow()
        println("vcJson: $vcJson")
    }

    fun testVCJsonGenerationFlow2(vcID: String) {
        // The flow should return the first commit of the BitCoin readme.
        val flow = VCJsonGenerationFlow("VCAuthOrg", vcID, 7 * 60 * 60)
        val future = revocationMngNodes[0].startFlow(flow)
        network.runNetwork()
        val vcJson = future.getOrThrow()
        println("vcJson: $vcJson")
    }

    private fun queryStatus() {
        println("queryStatus")

        val flow1 = QueryVCJsonStates()
        val future1: CordaFuture<List<StateAndRef<VCJsonState>>> = authCompanyNode.startFlow(flow1)

        network.runNetwork()
        val vcJsonStates = future1.getOrThrow()
        vcJsonStates.forEach { println(it.state.data) }

    }

    private fun printAllStates(){
        println("printAllStates:")

        ( listOf(authOrgNode, authCompanyNode) +  revocationMngNodes ).forEach { node ->
            println("##################################")
            println("Node: ${node.info.legalIdentitiesAndCerts.first().name}")
            val inputCriteria: QueryCriteria = QueryCriteria.VaultQueryCriteria().withStatus(Vault.StateStatus.UNCONSUMED)
            node.services.vaultService.queryBy(ContractState::class.java, inputCriteria).states
                .map { it.state }
                .forEach { println("------ $it") }

        }
    }
}