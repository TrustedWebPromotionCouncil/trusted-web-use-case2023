package com.example.wearable.trustapp.biowatcher.domain.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.wearable.trustapp.biowatcher.common.Constants.STEP_TABLE
import kotlinx.serialization.Serializable

// 歩数[1日単位のデータ]
@Serializable
@Entity(tableName = STEP_TABLE)
data class Step(
    @PrimaryKey(autoGenerate = true)
    var id: Int,
    @ColumnInfo(name = "step")
    val step: Int,
    // 日付
    @ColumnInfo(name = "date")
    val date: String,
    @ColumnInfo(name = "created_at")
    val created_at: String,  // 作成日
    @ColumnInfo(name = "updated_at")
    val updated_at: String,  // 更新日
)
