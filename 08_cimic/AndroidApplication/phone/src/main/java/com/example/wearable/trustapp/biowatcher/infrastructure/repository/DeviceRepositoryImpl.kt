package com.example.wearable.trustapp.biowatcher.infrastructure.repository

import com.example.wearable.trustapp.biowatcher.domain.entity.DeviceEntity
import com.example.wearable.trustapp.biowatcher.domain.repository.DeviceRepository
import com.example.wearable.trustapp.biowatcher.infrastructure.dao.DeviceDao

class DeviceRepositoryImpl(
    private val deviceDao: DeviceDao,
) : DeviceRepository
{
    override fun getAll(): List<DeviceEntity> = deviceDao.getAll()
    override fun getValidAll(): List<DeviceEntity> = deviceDao.getValidAll()
    override fun findDevicesByNullId(): List<DeviceEntity> = deviceDao.findDevicesByNullId()
    override fun findById(deviceId: Int) = deviceDao.findById(deviceId)
    override fun findByDeviceType(deviceTypeId: Int) = deviceDao.findByDeviceType(deviceTypeId)
    override fun findByUri(deviceUri: String) = deviceDao.findByUri(deviceUri)
    override fun findByValidId(deviceId: Int) = deviceDao.findByValidId(deviceId)
    override fun findByValidDeviceType(deviceTypeId: Int) = deviceDao.findByValidDeviceType(deviceTypeId)
    override fun findByValidUri(deviceUri: String) = deviceDao.findByValidUri(deviceUri)
    override suspend fun add(device: DeviceEntity) = deviceDao.add(device)
    override suspend fun delete(device: DeviceEntity) = deviceDao.delete(device)
    override suspend fun deleteAll() = deviceDao.deleteAll()
    override suspend fun deleteByInvalid(deviceId: Int) = deviceDao.deleteByInvalid(deviceId)
    override suspend fun updateCoroutine(device: DeviceEntity) = deviceDao.updateCoroutine(device)
    override fun update(device: DeviceEntity) = deviceDao.update(device)
}