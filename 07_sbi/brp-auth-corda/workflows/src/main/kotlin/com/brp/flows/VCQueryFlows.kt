package com.brp.flows

import co.paralleluniverse.fibers.Suspendable
import com.brp.schema.VCSchemaV1
import com.brp.states.VCJsonState
import com.brp.states.VCState
import net.corda.core.contracts.StateAndRef
import net.corda.core.flows.FlowLogic
import net.corda.core.flows.InitiatingFlow
import net.corda.core.flows.StartableByRPC
import net.corda.core.node.services.Vault
import net.corda.core.node.services.queryBy
import net.corda.core.node.services.vault.*


@StartableByRPC
@InitiatingFlow
class QueryVCStateById(
    private val linearId: String) : FlowLogic<List<StateAndRef<VCState>>>() {

    @Suspendable
    override fun call(): List<StateAndRef<VCState>> {
        val pageSpec = PageSpecification(pageNumber = DEFAULT_PAGE_NUM, pageSize = DEFAULT_PAGE_SIZE)
        val queryResults = serviceHub.vaultService.queryBy<VCState>(query(), pageSpec)
        return queryResults.states
    }

    @Suspendable
    private fun query(): QueryCriteria {
        return builder {
            val key = VCSchemaV1.PersistentVC::linearId.equal(linearId)
            QueryCriteria.VaultCustomQueryCriteria(key)
        }
    }
}


@StartableByRPC
@InitiatingFlow
class QueryVCStateListByStatus(
    private val  status: String) : FlowLogic<List<StateAndRef<VCState>>>() {

    @Suspendable
    override fun call(): List<StateAndRef<VCState>> {
        val criteria: QueryCriteria = QueryCriteria.VaultQueryCriteria()
            .withStatus(Vault.StateStatus.UNCONSUMED)

        val results = greedyQuery<VCState>(criteria, serviceHub.vaultService)
        return results
            .filter { it.state.data.status == status }
            .sortedByDescending { it.state.data.updatedTime }
    }
}

@StartableByRPC
@InitiatingFlow
class QueryVCJsonStates() : FlowLogic<List<StateAndRef<VCJsonState>>>() {

    @Suspendable
    override fun call(): List<StateAndRef<VCJsonState>> {
        val criteria: QueryCriteria = QueryCriteria.VaultQueryCriteria()
            .withStatus(Vault.StateStatus.UNCONSUMED)

        val results = greedyQuery<VCJsonState>(criteria, serviceHub.vaultService)
        return results.sortedByDescending { it.state.data.vcID }
    }
}