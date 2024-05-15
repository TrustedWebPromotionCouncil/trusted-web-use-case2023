package com.brp.webserver.controller

import com.brp.data.*
import com.brp.flows.*
import com.brp.helpers.ConstVariables
import com.brp.webserver.NodeRPCConnection
import com.google.gson.Gson
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Define your API endpoints here.
 */
@RestController
@RequestMapping("/corda") // The paths for HTTP requests are relative to this base path.
open class NodeController(val rpc: NodeRPCConnection) {

    companion object {
        private val logger = LoggerFactory.getLogger(RestController::class.java)
    }

    private val cordaProxy = rpc.proxy

    @GetMapping(value = ["/version"])
    private fun ping(): ResponseEntity<*>? {
        logger.info("version.")
        return ResponseEntity.ok().body("v1.0")
    }

    @GetMapping(value = ["/get-corda-network-info"])
    private fun getCordaNetworkInfo(): ResponseEntity<*>? {
        logger.info("getCordaNetworkInfo.")
        cordaProxy.networkMapSnapshot().forEach{
            logger.info("id: ${it.legalIdentities.first().name.organisation}, address: ${it.addresses}")
        }
        val nodes = cordaProxy.networkMapSnapshot().map { "id: ${it.legalIdentities}" }
        return ResponseEntity.ok().body(nodes)
    }

    @GetMapping(value = ["/get-my-identity"])
    private fun getMyIdentity(): ResponseEntity<*>? {
        logger.info("getMyIdentity.")
        val myIdentity = cordaProxy.nodeInfo().legalIdentities.first().name.organisation
        println("My identity: $myIdentity")
        println("My Role: ${rpc.rpcRole}")
        return ResponseEntity.ok().body(myIdentity)
    }

    @GetMapping(value = ["/get-my-role"])
    private fun getMyRole(): ResponseEntity<*>? {
        logger.info("getMyRole.")
        println("My Role: ${rpc.rpcRole}")
        return ResponseEntity.ok().body(rpc.rpcRole)
    }

    /** 認証機構(失効管理体)用のVC発行に関連するAPI */

    @PostMapping(value = ["/vc-json"])
    private fun generateVCJson(@RequestBody req: CordaAPIReqVCJsonGeneration): ResponseEntity<*>? {

        logger.info("generateVCJson, $req")

        val role = rpc.rpcRole
        if (!listOf(
                ConstVariables.RPC_ROLE_AUTH_ORG_CONSORTIUM,
                ConstVariables.RPC_ROLE_AUTH_COMPANY).contains(role)){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return try {
            val res =cordaProxy.startFlowDynamic(
                VCJsonGenerationFlow::class.java,
                req.authOrgName,
                req.vcID,
                req.validityPeriod
            ).returnValue.get()

            logger.info("VCJsonGenerationFlow has been done!")

            val gson = Gson()
            val jsonObject = gson.fromJson(res, Any::class.java)
            ResponseEntity.ok().body(jsonObject)
        } catch (e: Exception) {
            logger.error("Corda exception happened! $e")
            return ResponseEntity.status(500).body(e.message)
        }
    }

    private fun getVCJsonListByRoleFilter(roleFilter : String = ""): ResponseEntity<*>? {

        logger.info("getVCJsonListByRoleFilter. RoleFilter: $roleFilter")

        try {
            val res =cordaProxy.startFlowDynamic(
                QueryVCJsonStates::class.java
            ).returnValue.get()
            logger.info("QueryVCJsonStates has been done!")

            val gson = Gson()

            val vcJsonList = when(roleFilter)  {
                ConstVariables.RPC_ROLE_AUTH_ORG_CONSORTIUM ->
                    res.filter { ConstVariables.RevocationMngCompanyNameRegex.matches(it.state.data.authCompany.name.organisation) }
                ConstVariables.RPC_ROLE_AUTH_COMPANY ->
                    res.filter { !ConstVariables.RevocationMngCompanyNameRegex.matches(it.state.data.authCompany.name.organisation) }
                else ->
                    res
            }.map {
                gson.fromJson(it.state.data.vcJson, Any::class.java)
            }
            return ResponseEntity.ok().body(vcJsonList)
        } catch (e: Exception) {
            logger.error("Corda exception happened! $e")
            return ResponseEntity.status(500).body(e.message)
        }
    }

    @GetMapping(value = ["/vc-json-list"])
    private fun getVCJsonList(): ResponseEntity<*>? {

        logger.info("getVCJsonList")

        val role = rpc.rpcRole
        if (!listOf(
                ConstVariables.RPC_ROLE_AUTH_ORG_CONSORTIUM,
                ConstVariables.RPC_ROLE_AUTH_COMPANY).contains(role)){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return getVCJsonListByRoleFilter()
    }

    @GetMapping(value = ["/vc-json-list-for-auth-consortium"])
    private fun getVCJsonList4AuthConsortium(): ResponseEntity<*>? {

        logger.info("getVCJsonList4AuthConsortium")

        val role = rpc.rpcRole
        if (ConstVariables.RPC_ROLE_AUTH_ORG != role){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return getVCJsonListByRoleFilter(ConstVariables.RPC_ROLE_AUTH_ORG_CONSORTIUM)
    }

    @GetMapping(value = ["/vc-json-list-for-auth-company"])
    private fun getVCJsonList4AuthCompany(): ResponseEntity<*>? {

        logger.info("getVCJsonList4AuthCompany")

        val role = rpc.rpcRole
        if (ConstVariables.RPC_ROLE_AUTH_ORG != role){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return getVCJsonListByRoleFilter(ConstVariables.RPC_ROLE_AUTH_COMPANY)
    }

    /** 事業所用VCの失効管理に関連するAPI */

    @PostMapping(value = ["/revocation/vc"])
    private fun vcRegistration(): ResponseEntity<*>? {

        logger.info("vcRegistration.")

        val role = rpc.rpcRole
        if (ConstVariables.RPC_ROLE_AUTH_COMPANY != role){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return try {
            val res =cordaProxy.startFlowDynamic(VCRegistration::class.java).returnValue.get()
            logger.info("VCRegistration has been done!")

            ResponseEntity.ok().body(CordaAPIResVCRegistration(res.first, res.second))
        } catch (e: Exception) {
            logger.error("Corda exception happened! $e")
            return ResponseEntity.status(500).body(e.message)
        }
    }

    @DeleteMapping("/revocation/vc/{uuid}")
    private fun vcRevocation(@PathVariable uuid: String): ResponseEntity<*>? {
        logger.info("vcRevocation. UUID: $uuid")

        val role = rpc.rpcRole
        if (ConstVariables.RPC_ROLE_AUTH_COMPANY != role){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return try {
            val res =cordaProxy.startFlowDynamic(
                VCRevocation::class.java,
                uuid
            ).returnValue.get()
            logger.info("VCRevocation has been done!")

            ResponseEntity.ok().body(CordaAPIResVCBlockHash(res.id.toString()))
        } catch (e: Exception) {
            logger.error("Corda exception happened! $e")
            return ResponseEntity.status(500).body(e.message)
        }
    }

    @PutMapping("/revocation/vc/{uuid}")
    private fun vcUpdate(@PathVariable uuid: String): ResponseEntity<*>? {
        logger.info("vcUpdate. UUID: $uuid")

        val role = rpc.rpcRole
        if (ConstVariables.RPC_ROLE_AUTH_COMPANY != role){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return try {
            val res =cordaProxy.startFlowDynamic(
                VCUpdate::class.java,
                uuid
            ).returnValue.get()
            logger.info("VCUpdate has been done!")

            ResponseEntity.ok().body(CordaAPIResVCRegistration(res.first, res.second))
        } catch (e: Exception) {
            logger.error("Corda exception happened! $e")
            return ResponseEntity.status(500).body(e.message)
        }
    }

    @GetMapping("/revocation/vc-status/{uuid}")
    private fun getVCStateById(@PathVariable uuid: String): ResponseEntity<*>? {
        logger.info("getVCStateById. UUID: $uuid")

        val role = rpc.rpcRole
        if (ConstVariables.RPC_ROLE_AUTH_ORG_CONSORTIUM != role){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return try {
            val res =cordaProxy.startFlowDynamic(
                QueryVCStateById::class.java,
                uuid
            ).returnValue.get()
            logger.info("QueryVCStateById has been done!")

            val vcStatus = if (res.isEmpty())
                                ConstVariables.VCUnknownStatus
                            else
                                res.first().state.data.status

            ResponseEntity.ok().body(CordaAPIResVCStatus(vcStatus))
        } catch (e: Exception) {
            logger.error("Corda exception happened! $e")
            return ResponseEntity.status(500).body(e.message)
        }
    }

    private fun getVCStateListByStatus(status: String): ResponseEntity<*>? {
        logger.info("getVCStateListByStatus. status: $status")

        val role = rpc.rpcRole
        if (!listOf(
                ConstVariables.RPC_ROLE_AUTH_ORG_CONSORTIUM,
                ConstVariables.RPC_ROLE_AUTH_COMPANY).contains(role)){
            val errMes ="Role: $role is not expected."
            logger.error(errMes)
            return ResponseEntity.status(401).body(errMes)
        }

        return try {
            val res =cordaProxy.startFlowDynamic(
                QueryVCStateListByStatus::class.java,
                status
            ).returnValue.get().map{ CordaAPIResVCUUID(it.state.data.linearId.toString()) }
            logger.info("QueryVCStateListByStatus has been done!")

            ResponseEntity.ok().body(res)
        } catch (e: Exception) {
            logger.error("Corda exception happened! $e")
            return ResponseEntity.status(500).body(e.message)
        }
    }

    @GetMapping("/revocation/vc-valid-list")
    private fun getVCValidList(): ResponseEntity<*>? {
        logger.info("getVCValidList.")
        return getVCStateListByStatus(ConstVariables.VCValidStatus)
    }

    @GetMapping("/revocation/vc-revoked-list")
    private fun getVCRevokedList(): ResponseEntity<*>? {
        logger.info("getVCRevokedList.")
        return getVCStateListByStatus(ConstVariables.VCRevokedStatus)
    }
}
