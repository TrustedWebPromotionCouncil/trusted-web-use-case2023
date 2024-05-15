package com.example.wearable.trustapp.biowatcher.infrastructure.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.example.wearable.trustapp.biowatcher.common.Constants.ROOM_BOOLEAN_FALSE
import com.example.wearable.trustapp.biowatcher.common.Constants.ROOM_BOOLEAN_TRUE
import com.example.wearable.trustapp.biowatcher.domain.entity.DeviceEntity
import com.example.wearable.trustapp.biowatcher.common.Constants.DEVICE_TABLE

@Dao
interface DeviceDao {
    @Query("SELECT * FROM $DEVICE_TABLE $ORDER_BY")
    fun getAll(): List<DeviceEntity>
    @Query("SELECT * FROM $DEVICE_TABLE WHERE is_valid = $ROOM_BOOLEAN_TRUE $ORDER_BY")
    fun getValidAll(): List<DeviceEntity>
    @Query("SELECT * FROM $DEVICE_TABLE WHERE device_td_id IS NULL $ORDER_BY")
    fun findDevicesByNullId(): List<DeviceEntity>

    @Query(
        "SELECT * FROM $DEVICE_TABLE WHERE id = :deviceId $ORDER_BY"
    )
    fun findById(deviceId: Int): DeviceEntity
    @Query(
        "SELECT * FROM $DEVICE_TABLE WHERE device_type_id = :deviceTypeId $ORDER_BY"
    )
    fun findByDeviceType(deviceTypeId: Int): List<DeviceEntity>

    @Query(
        "SELECT * FROM $DEVICE_TABLE WHERE device_uri = :deviceUri $ORDER_BY"
    )
    fun findByUri(deviceUri: String): DeviceEntity

    @Query(
        "SELECT * FROM $DEVICE_TABLE WHERE id = :deviceId AND is_valid = $ROOM_BOOLEAN_TRUE $ORDER_BY"
    )
    fun findByValidId(deviceId: Int): DeviceEntity
    @Query(
        "SELECT * FROM $DEVICE_TABLE WHERE device_type_id = :deviceTypeId AND is_valid = $ROOM_BOOLEAN_TRUE $ORDER_BY"
    )
    fun findByValidDeviceType(deviceTypeId: Int): List<DeviceEntity>

    @Query(
        "SELECT * FROM $DEVICE_TABLE WHERE device_uri = :deviceUri AND is_valid = $ROOM_BOOLEAN_TRUE $ORDER_BY"
    )
    fun findByValidUri(deviceUri: String): DeviceEntity

    @Insert
    suspend fun add(device: DeviceEntity)

    @Delete
    suspend fun delete(device: DeviceEntity)

    @Query("DELETE FROM $DEVICE_TABLE")
    suspend fun deleteAll()

    @Query("DELETE FROM $DEVICE_TABLE WHERE id = :deviceId AND is_valid = $ROOM_BOOLEAN_TRUE")
    suspend fun deleteByInvalid(deviceId: Int)

    @Update
    suspend fun updateCoroutine(device: DeviceEntity)
    @Update
    fun update(device: DeviceEntity)

    private companion object {
        const val ORDER_BY = " ORDER BY id"
    }
}
