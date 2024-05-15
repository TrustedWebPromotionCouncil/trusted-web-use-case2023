package com.example.wearable.trustapp.biowatcher.infrastructure.repository

import com.example.wearable.trustapp.biowatcher.infrastructure.dao.EncryptDao
import com.example.wearable.trustapp.biowatcher.domain.entity.EncryptEntity
import com.example.wearable.trustapp.biowatcher.domain.repository.EncryptRepository

class EncryptRepositoryImpl(
    private val encryptDao: EncryptDao,
) : EncryptRepository {
    override fun getAll(): List<EncryptEntity> = encryptDao.getAll()
    override fun findByDate(date: String, deviceTdId: Int, dataType: Int) =
        encryptDao.findByDate(date, deviceTdId, dataType)

    override fun findBeforeDate(date: String): List<EncryptEntity> = encryptDao.findBeforeDate(date)
    override suspend fun add(encryptData: EncryptEntity) = encryptDao.add(encryptData)
    override suspend fun delete(encryptData: EncryptEntity) = encryptDao.delete(encryptData)
    override suspend fun deleteAll() = encryptDao.deleteAll()
    override suspend fun deleteByDate(date: String, deviceTdId: Int, dataType: Int) =
        encryptDao.deleteByDate(date, deviceTdId, dataType)
    override suspend fun deleteBeforeDate(date: String) = encryptDao.deleteBeforeDate(date)

    override suspend fun update(encryptData: EncryptEntity) = encryptDao.update(encryptData)
}