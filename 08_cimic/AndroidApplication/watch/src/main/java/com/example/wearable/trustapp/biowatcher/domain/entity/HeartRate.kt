package com.example.wearable.trustapp.biowatcher.domain.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.wearable.trustapp.biowatcher.common.Constants.HEART_RATE_TABLE
import kotlinx.serialization.Serializable

// 心拍数[10分単位のデータ]
@Serializable
@Entity(tableName = HEART_RATE_TABLE)
data class HeartRate(
    @PrimaryKey(autoGenerate = true)
    var id: Int,
    // 日付
    @ColumnInfo(name = "date")
    val date: String,   // yyyy/MM/dd
    // 時間(hh:mm:ss)
    @ColumnInfo(name = "hh")
    val hh: String, // 2桁
    @ColumnInfo(name = "mmStart")
    val mmStart: String, // 2桁
    @ColumnInfo(name = "mmFinish")
    val mmFinish: String, // 2桁
    @ColumnInfo(name = "maxPulse")
    val maxPulse: Int,
    @ColumnInfo(name = "minPulse")
    val minPulse: Int,
    @ColumnInfo(name = "avePulse")
    val avePulse: Int,
    @ColumnInfo(name = "created_at")
    val created_at: String,  // 作成日
    @ColumnInfo(name = "updated_at")
    val updated_at: String,  // 更新日
)
