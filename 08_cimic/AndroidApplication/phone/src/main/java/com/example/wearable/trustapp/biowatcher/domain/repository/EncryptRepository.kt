package com.example.wearable.trustapp.biowatcher.domain.repository

import com.example.wearable.trustapp.biowatcher.domain.entity.EncryptEntity

interface EncryptRepository {
    fun getAll(): List<EncryptEntity>
    fun findByDate(date: String, deviceTdId: Int, dataType: Int): EncryptEntity
    fun findBeforeDate(date: String): List<EncryptEntity>
    suspend fun add(encryptData: EncryptEntity)
    suspend fun delete(encryptData: EncryptEntity)
    suspend fun deleteAll()
    suspend fun deleteByDate(date: String, deviceTdId: Int, dataType: Int)
    suspend fun deleteBeforeDate(date: String)
    suspend fun update(encryptEntity: EncryptEntity)
}