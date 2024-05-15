package com.example.wearable.trustapp.biowatcher.infrastructure.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.example.wearable.trustapp.biowatcher.domain.entity.HeartRate
import com.example.wearable.trustapp.biowatcher.common.Constants.HEART_RATE_TABLE

@Dao
interface HeartRateDao {
    @Query("SELECT * FROM $HEART_RATE_TABLE $ORDER_BY")
    fun getAll(): List<HeartRate>

    @Query("SELECT * FROM $HEART_RATE_TABLE WHERE date = :date $ORDER_BY")
    fun findByDate(date: String): HeartRate

    @Insert
    suspend fun addHeartRate(heartRate: HeartRate)

    @Delete
    suspend fun deleteHeartRate(heartRate: HeartRate)

    @Query("DELETE FROM $HEART_RATE_TABLE")
    suspend fun deleteAllHeartRates()

    @Query("DELETE FROM $HEART_RATE_TABLE WHERE date = :date")
    suspend fun deleteHeartRateByDate(date: String)

    // dateがX以上前のデータを削除する(注：文字列の比較のため注意)
    @Query("DELETE FROM $HEART_RATE_TABLE WHERE date < :date")
    suspend fun deleteHeartRateBeforeDate(date: String)

    @Update
    suspend fun updateHeartRate(heartRate: HeartRate)

    private companion object {
        const val ORDER_BY = " ORDER BY date, hh, mmStart"
    }
}
