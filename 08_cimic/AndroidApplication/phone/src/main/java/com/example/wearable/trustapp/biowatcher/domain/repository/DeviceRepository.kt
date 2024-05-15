package com.example.wearable.trustapp.biowatcher.domain.repository

import com.example.wearable.trustapp.biowatcher.domain.entity.DeviceEntity

interface DeviceRepository {
    fun getAll(): List<DeviceEntity>
    fun getValidAll(): List<DeviceEntity>
    fun findDevicesByNullId(): List<DeviceEntity>
    fun findById(deviceId: Int): DeviceEntity
    fun findByDeviceType(deviceTypeId: Int): List<DeviceEntity>
    fun findByUri(deviceUri: String): DeviceEntity
    fun findByValidId(deviceId: Int): DeviceEntity
    fun findByValidDeviceType(deviceTypeId: Int): List<DeviceEntity>

    fun findByValidUri(deviceUri: String): DeviceEntity
    suspend fun add(device: DeviceEntity)
    suspend fun delete(device: DeviceEntity)
    suspend fun deleteAll()
    suspend fun deleteByInvalid(deviceId: Int)
    suspend fun updateCoroutine(device: DeviceEntity)
    fun update(device: DeviceEntity)
}