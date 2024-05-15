package com.example.wearable.trustapp.biowatcher.domain.repository

import com.example.wearable.trustapp.biowatcher.domain.entity.HeartRate

interface HeartRateRepository {
    fun getAll(): List<HeartRate>
    fun findByDate(date: String): HeartRate
    suspend fun add(heartRate: HeartRate)
    suspend fun delete(heartRate: HeartRate)
    suspend fun deleteAll()
    suspend fun deleteByDate(date: String)
    suspend fun deleteHeartRateBeforeDate(date: String)
    suspend fun update(heartRate: HeartRate)
}