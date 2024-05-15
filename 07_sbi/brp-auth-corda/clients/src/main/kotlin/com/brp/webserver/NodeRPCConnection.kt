package com.brp.webserver

import com.brp.helpers.ConstVariables
import net.corda.client.rpc.CordaRPCClient
import net.corda.client.rpc.CordaRPCConnection
import net.corda.core.messaging.ClientRpcSslOptions
import net.corda.core.messaging.CordaRPCOps
import net.corda.core.utilities.NetworkHostAndPort
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.nio.file.Paths
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

private const val CORDA_USER_NAME = "config.rpc.username"
private const val CORDA_USER_PASSWORD = "config.rpc.password"
private const val CORDA_NODE_HOST = "config.rpc.host"
private const val CORDA_RPC_PORT = "config.rpc.port"
private const val RPC_SSL_ENABLED = "config.rpc.ssl.enabled"
private const val RPC_SSL_PATH = "config.rpc.ssl.truststorepath"
private const val RPC_SSL_PASSWORD = "config.rpc.ssl.truststorepassword"
private const val RPC_ROLE = "config.rpc.role"

private val RPC_ROLE_LIST = setOf(
    ConstVariables.RPC_ROLE_AUTH_ORG,
    ConstVariables.RPC_ROLE_AUTH_ORG_CONSORTIUM,
    ConstVariables.RPC_ROLE_AUTH_COMPANY
)

/**
 * Wraps an RPC connection to a Corda node.
 *
 * The RPC connection is configured using command line arguments.
 *
 * @param host The host of the node we are connecting to.
 * @param rpcPort The RPC port of the node we are connecting to.
 * @param username The username for logging into the RPC client.
 * @param password The password for logging into the RPC client.
 * @property proxy The RPC proxy.
 */
@Component
open class NodeRPCConnection(
        @Value("\${$CORDA_NODE_HOST}") private val host: String,
        @Value("\${$CORDA_USER_NAME}") private val username: String,
        @Value("\${$CORDA_USER_PASSWORD}") private val password: String,
        @Value("\${$CORDA_RPC_PORT}") private val rpcPort: Int,
        @Value("\${$RPC_SSL_ENABLED}") private val sslEnabled: Boolean,
        @Value("\${$RPC_SSL_PATH}") private val rpcSslPath: String,
        @Value("\${$RPC_SSL_PASSWORD}") private val rpcSslPassword: String,
        @Value("\${$RPC_ROLE}") val rpcRole: String): AutoCloseable {

    lateinit var rpcConnection: CordaRPCConnection
        private set
    lateinit var proxy: CordaRPCOps
        private set

    companion object {
        private val logger = LoggerFactory.getLogger(NodeRPCConnection::class.java)
    }

    @PostConstruct
    fun initialiseNodeRPCConnection() {

        logger.info("Role was set to $rpcRole.")
        if (!RPC_ROLE_LIST.contains(rpcRole)) {
            logger.error("Role: $rpcRole is not expected.")
            return
        }

        val rpcAddress = NetworkHostAndPort(host, rpcPort)

        val rpcClient = if(sslEnabled) {
            val clientRpcSslOptions = ClientRpcSslOptions(Paths.get(rpcSslPath), rpcSslPassword, "JKS")
            CordaRPCClient(rpcAddress, clientRpcSslOptions, null)
        }else{
            CordaRPCClient(rpcAddress)
        }
        val rpcConnection = rpcClient.start(username, password)
        proxy = rpcConnection.proxy
    }

    @PreDestroy
    override fun close() {
        rpcConnection.notifyServerAndClose()
    }
}