package com.example.wearable.trustapp.biowatcher.domain.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.wearable.trustapp.biowatcher.common.Constants.DEVICE_TABLE
import kotlinx.serialization.Serializable

// デバイス
@Serializable
@Entity(tableName = DEVICE_TABLE)
data class DeviceEntity(
    @PrimaryKey(autoGenerate = true)
    var id: Int,

    // TD側管理ID(TDのprimary key)
    @ColumnInfo(name = "device_td_id")
    val deviceTdId: Int? = null,
    // 1 : TicWatch E3, 2 : Fitbit
    @ColumnInfo(name = "device_type_id")
    val deviceTypeId: Int,
    // URI
    @ColumnInfo(name = "device_uri")
    val deviceUri: String,
    @ColumnInfo(name = "device_name")
    val name: String="",
    @ColumnInfo(name = "device_sub_name")
    val subName: String = "",

    // TDのis_validフラグとは違う。
    // TD側のis_validは、TD側のデバイスが有効かどうかを示すフラグ。
    // こっちはデバイス自体を削除したりするかどうかを示すフラグ(基本使わない)
    @ColumnInfo(name = "is_valid")
    var isValid: Boolean = true,
    @ColumnInfo(name = "created_at")
    val createdAt: String,  // 作成日
    @ColumnInfo(name = "updated_at")
    var updatedAt: String,  // 更新日
)
