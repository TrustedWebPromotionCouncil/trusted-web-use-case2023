package com.brp.flows

import co.paralleluniverse.fibers.Suspendable
import com.brp.data.*
import com.brp.helpers.ConstVariables
import com.google.gson.Gson
import net.corda.core.contracts.ContractState
import net.corda.core.contracts.StateAndRef
import net.corda.core.node.services.VaultService
import net.corda.core.node.services.queryBy
import net.corda.core.node.services.vault.DEFAULT_PAGE_NUM
import net.corda.core.node.services.vault.DEFAULT_PAGE_SIZE
import net.corda.core.node.services.vault.PageSpecification
import net.corda.core.node.services.vault.QueryCriteria
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody

/* Util function to aggressively make vault query for ContractState without pagination. */
inline fun <reified T : ContractState> greedyQuery(criteria: QueryCriteria, vaultService: VaultService) :  List<StateAndRef<T>>{
    var page = DEFAULT_PAGE_NUM
    val results = mutableListOf<StateAndRef<T>>()

    // Keep querying as long as there are more results
    do {
        val pageSpec = PageSpecification(pageNumber = page, pageSize = DEFAULT_PAGE_SIZE)
        val pageResults = vaultService
                .queryBy<T>(criteria, pageSpec)
        results.addAll(pageResults.states)
        page += 1
    } while ((pageSpec.pageSize * (page - 1)) <= pageResults.totalStatesAvailable)

    return results.toList()
}

@Suspendable
fun getKeyName4AuthOrg(): String {
    val goAPIUrl = "${ConstVariables.InternalGoAPIURL}/api/keyName4AuthOrg"
    val httpRequest = Request.Builder().url(goAPIUrl).build()
    val httpResponse = OkHttpClient().newCall(httpRequest).execute()

    if (!httpResponse.isSuccessful) return ""
    val res = httpResponse.body().string() ?: return ""

    val gson = Gson()
    val myKeyName = gson.fromJson(res, GoResKeyName::class.java)
    return myKeyName.keyName
}

@Suspendable
fun getPublicKey(keyName: String): String {
    val goAPIUrl = "${ConstVariables.InternalGoAPIURL}/api/publicKeyMultibase/${keyName}"
    val httpRequest = Request.Builder().url(goAPIUrl).build()
    val httpResponse = OkHttpClient().newCall(httpRequest).execute()

    if (!httpResponse.isSuccessful) return ""
    val res = httpResponse.body().string() ?: return ""

    val gson = Gson()
    val myKey = gson.fromJson(res, GoResPublicKey::class.java)
    return myKey.publicKeyMultibase
}

@Suspendable
fun getVC(vcReq: GoReqVC): String {
    val json = Gson().toJson(vcReq)
    val mediaType = MediaType.parse("application/json")
    val requestBody = RequestBody.create(mediaType, json)

    val goAPIUrl = "${ConstVariables.InternalGoAPIURL}/api/vc"
    val httpRequest = Request.Builder()
        .url(goAPIUrl)
        .post(requestBody)
        .build()
    val httpResponse = OkHttpClient().newCall(httpRequest).execute()

    if (!httpResponse.isSuccessful) return ""
    return httpResponse.body().string() ?: return ""
}

@Suspendable
fun didStringFromX500Name(x500Name: String): String {
    val json = Gson().toJson(GoReqSingleString(x500Name))
    val mediaType = MediaType.parse("application/json")
    val requestBody = RequestBody.create(mediaType, json)

    val goAPIUrl = "${ConstVariables.InternalGoAPIURL}/api/didStringFromX500Name"
    val httpRequest = Request.Builder()
        .url(goAPIUrl)
        .post(requestBody)
        .build()
    val httpResponse = OkHttpClient().newCall(httpRequest).execute()

    if (!httpResponse.isSuccessful) return ""
    val resJson = httpResponse.body().string() ?: return ""

    val gson = Gson()
    val apiResponse = gson.fromJson(resJson, GoResSingleString::class.java)
    return apiResponse.resString
}

@Suspendable
fun getIssuerName(cordaNameString: String): String {

    val issuerName = when (cordaNameString) {
        /* JP */
        "OU=AuthDept, O=VCAuthOrg, L=Tokyo, C=JP"                 -> "JP Accreditation Organization"
        "OU=AuthDept, O=VCAuthOrgConsortium000001, L=Tokyo, C=JP" -> "JP VC Revocation Control Organization 1"
        "OU=AuthDept, O=VCAuthOrgConsortium000002, L=Tokyo, C=JP" -> "JP VC Revocation Control Organization 2"
        "OU=AuthDept, O=VCAuthCom1, L=Tokyo, C=JP"                -> "JP Digital Certificate Organization 1"
        "OU=AuthDept, O=VCAuthCom2, L=Tokyo, C=JP"                -> "JP Digital Certificate Organization 2"
        /* TW */
        "OU=AuthDept, O=VCAuthOrg, L=Taipei, C=TW"                 -> "TW Accreditation Organization"
        "OU=AuthDept, O=VCAuthOrgConsortium000001, L=Taipei, C=TW" -> "TW Revocation Administration Service 1"
        "OU=AuthDept, O=VCAuthOrgConsortium000002, L=Taipei, C=TW" -> "TW Revocation Administration Service 2"
        "OU=AuthDept, O=VCAuthCom1, L=Taipei, C=TW"                -> "TW Digital Certificate Organization 1"
        "OU=AuthDept, O=VCAuthCom2, L=Taipei, C=TW"                -> "TW Digital Certificate Organization 2"
        /* Default */
        else -> ""
    }
    return issuerName
}

@Suspendable
fun getDID(cordaNameString: String): String {
    val issuerNameNoSpace = getIssuerName(cordaNameString).filter { !it.isWhitespace() }
    val issuerDIDNameFromX500 = didStringFromX500Name(cordaNameString)
    return "${ConstVariables.DIDScheme}:$issuerNameNoSpace:$issuerDIDNameFromX500"
}