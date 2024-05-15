package com.example.wearable.trustapp.biowatcher.domain.repository

import com.example.wearable.trustapp.biowatcher.domain.entity.FitbitTokenEntity

interface FitbitTokenRepository {
    fun getAll(): List<FitbitTokenEntity>
    fun findByClientId(clientId: String): FitbitTokenEntity
    suspend fun add(fitbitTokenEntity: FitbitTokenEntity)
    suspend fun delete(fitbitTokenEntity: FitbitTokenEntity)
    suspend fun deleteAll()
    suspend fun update(fitbitTokenEntity: FitbitTokenEntity)
}