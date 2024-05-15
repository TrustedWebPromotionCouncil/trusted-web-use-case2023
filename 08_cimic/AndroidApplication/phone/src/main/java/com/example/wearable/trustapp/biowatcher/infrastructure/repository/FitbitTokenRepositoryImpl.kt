package com.example.wearable.trustapp.biowatcher.infrastructure.repository

import com.example.wearable.trustapp.biowatcher.domain.entity.FitbitTokenEntity
import com.example.wearable.trustapp.biowatcher.domain.repository.FitbitTokenRepository
import com.example.wearable.trustapp.biowatcher.infrastructure.dao.FitbitTokenDao

class FitbitTokenRepositoryImpl(
    private val fitbitTokenDao: FitbitTokenDao,
) : FitbitTokenRepository {
    override fun getAll():List<FitbitTokenEntity> = fitbitTokenDao.getAll()
    override fun findByClientId(clientId: String): FitbitTokenEntity = fitbitTokenDao.findByClientId(clientId)
    override suspend fun add(fitbitTokenEntity: FitbitTokenEntity) = fitbitTokenDao.add(fitbitTokenEntity)
    override suspend fun delete(fitbitTokenEntity: FitbitTokenEntity) = fitbitTokenDao.delete(fitbitTokenEntity)
    override suspend fun deleteAll() = fitbitTokenDao.deleteAll()
    override suspend fun update(fitbitTokenEntity: FitbitTokenEntity) = fitbitTokenDao.update(fitbitTokenEntity)
}
