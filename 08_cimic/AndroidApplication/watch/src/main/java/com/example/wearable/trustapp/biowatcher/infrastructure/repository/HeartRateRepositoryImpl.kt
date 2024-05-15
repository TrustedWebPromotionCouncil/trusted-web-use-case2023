package com.example.wearable.trustapp.biowatcher.infrastructure.repository

import com.example.wearable.trustapp.biowatcher.infrastructure.dao.HeartRateDao
import com.example.wearable.trustapp.biowatcher.domain.entity.HeartRate
import com.example.wearable.trustapp.biowatcher.domain.repository.HeartRateRepository

class HeartRateRepositoryImpl(
    private val heartRateDao: HeartRateDao,
) : HeartRateRepository
{
    override fun getAll(): List<HeartRate> = heartRateDao.getAll()
    override fun findByDate(date: String) = heartRateDao.findByDate(date)
    override suspend fun add(heartRate: HeartRate) = heartRateDao.addHeartRate(heartRate)
    override suspend fun delete(heartRate: HeartRate) = heartRateDao.deleteHeartRate(heartRate)
    override suspend fun deleteAll() = heartRateDao.deleteAllHeartRates()
    override suspend fun deleteByDate(date : String) = heartRateDao.deleteHeartRateByDate(date)
    override suspend fun deleteHeartRateBeforeDate(date : String) = heartRateDao.deleteHeartRateBeforeDate(date)
    override suspend fun update(heartRate: HeartRate) = heartRateDao.updateHeartRate(heartRate)
}