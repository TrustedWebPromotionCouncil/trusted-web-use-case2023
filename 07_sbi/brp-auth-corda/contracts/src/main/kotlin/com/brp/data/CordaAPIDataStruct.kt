package com.brp.data

data class CordaAPIReqVCJsonGeneration(
    val authOrgName: String,
    val vcID: String,
    val validityPeriod: Int
)

data class CordaAPIResVCRegistration(
    val blockHash: String,
    val uuid: String
)

data class CordaAPIResVCBlockHash(
    val blockHash: String
)

data class CordaAPIResVCUUID(
    val uuid: String
)

data class CordaAPIResVCStatus(
    val status: String
)