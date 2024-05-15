package com.brp.contracts

import net.corda.core.contracts.CommandData
import net.corda.core.contracts.Contract
import net.corda.core.contracts.requireSingleCommand
import net.corda.core.contracts.requireThat
import net.corda.core.transactions.LedgerTransaction

// ************
// * Contract *
// ************
class VCJsonContract : Contract {
    companion object {
        // Used to identify our contract when building a transaction.
        const val ID = "com.brp.contracts.VCJsonContract"
    }

    // A transaction is valid if the verify() function of the contract of all the transaction's input and output states
    // does not throw an exception.
    override fun verify(tx: LedgerTransaction) {
        // Verification logic goes here.
        val command = tx.commands.requireSingleCommand<Commands>()
//        val output = tx.outputsOfType<VCJsonState>().first()

        when (command.value) {
            is Commands.Create -> requireThat {
                "No inputs should be consumed".using(tx.inputStates.isEmpty())
                "Only one output state should be created." using (tx.outputs.size == 1)
            }
//            is Commands.Update -> requireThat {
//                "One input should be consumed".using(tx.inputStates.size == 1)
//                "Only one output state should be created." using (tx.outputs.size == 1)
//            }

        }
    }

    // Used to indicate the transaction's intent.
    interface Commands : CommandData {
        class Create : Commands
//        class Update : Commands
    }
}