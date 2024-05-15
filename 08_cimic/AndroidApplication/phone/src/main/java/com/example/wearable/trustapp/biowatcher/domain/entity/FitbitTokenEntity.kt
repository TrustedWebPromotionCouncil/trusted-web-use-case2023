package com.example.wearable.trustapp.biowatcher.domain.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.wearable.trustapp.biowatcher.common.Constants.FITBIT_TOKEN_TABLE
import kotlinx.serialization.Serializable

// FitbitTokenEntity
@Serializable
@Entity(tableName = FITBIT_TOKEN_TABLE)
data class FitbitTokenEntity(
    @PrimaryKey(autoGenerate = true)
    var id: Int,  // ID
    @ColumnInfo(name = "device_id")
    val deviceId:Int,  // デバイスID(DeviceEntityと紐づくID[DeviceEntityのid])
    @ColumnInfo(name = "client_id")
    val clientId: String = "",  // クライアントID
    @ColumnInfo(name = "auth_code")
    val authCode: String = "",  // 認証コード
    @ColumnInfo(name = "client_secret")
    val clientSecret: String = "",  // クライアントシークレット
    @ColumnInfo(name = "access_token")
    val accessToken: String = "",  // アクセストークン
    @ColumnInfo(name = "refresh_token")
    val refreshToken: String = "",  // リフレッシュトークン
    @ColumnInfo(name = "user_id")
    val userId: String = "",  // ユーザーID
    @ColumnInfo(name = "created_at")
    val createdAt: String,  // 作成日
    @ColumnInfo(name = "updated_at")
    val updatedAt: String,  // 更新日
)
