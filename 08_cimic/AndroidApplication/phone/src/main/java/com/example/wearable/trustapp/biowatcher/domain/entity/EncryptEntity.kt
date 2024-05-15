package com.example.wearable.trustapp.biowatcher.domain.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.wearable.trustapp.biowatcher.common.Constants.ENCRYPT_DATA_TABLE
import kotlinx.serialization.Serializable

// 心拍数[10分単位のデータ]
@Serializable
@Entity(tableName = ENCRYPT_DATA_TABLE)
data class EncryptEntity(
    @PrimaryKey(autoGenerate = true)
    var id: Int,
    // 日付
    @ColumnInfo(name = "date")
    val date: String,   // yyyy/MM/dd
    // 時間(hh:mm:ss)
    @ColumnInfo(name = "device_td_id")
    val deviceTdId: Int?,  // TD管理用ID
    @ColumnInfo(name = "data_type")
    val dataType: Int,  // ～_PULSE_ACTIVITY_ID: 心拍数, ～STEP_ACTIVITY_ID: 歩数
    @ColumnInfo(name = "encrypt_data")
    val encryptData: String, // 暗号化データ(文字列：TDにはバイナリデータを格納する)
    @ColumnInfo(name = "is_sent_to_td")
    var isSendToTD: Boolean = false,    // TDへ送信済みフラグ
    @ColumnInfo(name = "created_at")
    val createdAt: String,  // 作成日
    @ColumnInfo(name = "updated_at")
    val updatedAt: String,  // 更新日
)
