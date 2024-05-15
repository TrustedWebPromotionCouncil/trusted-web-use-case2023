package com.example.wearable.trustapp.biowatcher.infrastructure.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.example.wearable.trustapp.biowatcher.domain.entity.EncryptEntity
import com.example.wearable.trustapp.biowatcher.common.Constants.ENCRYPT_DATA_TABLE

@Dao
interface EncryptDao {
    @Query("SELECT * FROM $ENCRYPT_DATA_TABLE $ORDER_BY")
    fun getAll(): List<EncryptEntity>

    @Query(
        "SELECT * FROM $ENCRYPT_DATA_TABLE WHERE date = :date AND device_td_id = :deviceTdId AND data_type = :dataType $ORDER_BY"
    )
    fun findByDate(date: String, deviceTdId: Int, dataType: Int): EncryptEntity

    // dateより前のデータを取得(文字列の比較であることに注意。yyyy/MM/dd形式で比較すること)
    @Query(
        "SELECT * FROM $ENCRYPT_DATA_TABLE WHERE date < :date $ORDER_BY"
    )
    fun findBeforeDate(date: String): List<EncryptEntity>

    @Insert
    suspend fun add(encryptData: EncryptEntity)

    @Delete
    suspend fun delete(encryptData: EncryptEntity)

    @Query("DELETE FROM $ENCRYPT_DATA_TABLE")
    suspend fun deleteAll()

    @Query("DELETE FROM $ENCRYPT_DATA_TABLE WHERE date = :date AND device_td_id = :deviceTdId AND data_type = :dataType")
    suspend fun deleteByDate(date: String, deviceTdId: Int, dataType: Int)

    // dateがX以上前のデータを削除する(注：文字列の比較のため注意)
    @Query("DELETE FROM $ENCRYPT_DATA_TABLE WHERE date < :date")
    suspend fun deleteBeforeDate(date: String)

    @Update
    suspend fun update(encryptData: EncryptEntity)

    private companion object {
        const val ORDER_BY = " ORDER BY date, device_td_id, data_type"
    }
}
