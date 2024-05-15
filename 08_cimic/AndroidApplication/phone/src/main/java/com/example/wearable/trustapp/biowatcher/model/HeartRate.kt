package com.example.wearable.trustapp.biowatcher.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// 心拍数[10分単位のデータ]
interface IHeartRate{
    val date: String   // yyyy/MM/dd
    val hh: String // 2桁
    val mmStart: String // 2桁
    val mmFinish: String // 2桁
    val maxPulse: Int
    val minPulse: Int
    val avePulse: Int
}

@Serializable
data class HeartRate(
    override val date: String,   // yyyy/MM/dd
    override val hh: String, // 2桁
    override val mmStart: String, // 2桁
    override val mmFinish: String, // 2桁
    override val maxPulse: Int,
    override val minPulse: Int,
    override val avePulse: Int,
) : IHeartRate

@Serializable
data class DecryptHeartRateOfTicWatch(
    @SerialName("id") val id: Int,
    override val date: String,   // yyyy/MM/dd
    override val hh: String, // 2桁
    override val mmStart: String, // 2桁
    override val mmFinish: String, // 2桁
    override val maxPulse: Int,
    override val minPulse: Int,
    override val avePulse: Int,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
) : IHeartRate

data class HeartRateData(
    val yyyyMMdd: String,       // 日付
    val hh: String,       // 時
    val mmStart: String,    // 分(開始)
    val mmFinish: String,   // 分(終了)
    var maxPulse: Int,      // 心拍数の最大値
    var minPulse: Int,      // 心拍数の最小値
    var totalPulse: Int,    // 心拍数の合計
    var count: Int,         // 心拍数の取得回数
    var isCountFinished: Boolean = false, // 終了フラグ[true:終了, false:未終了]
)

