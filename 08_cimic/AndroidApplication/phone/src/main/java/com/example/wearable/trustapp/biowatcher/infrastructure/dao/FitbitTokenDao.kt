package com.example.wearable.trustapp.biowatcher.infrastructure.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.example.wearable.trustapp.biowatcher.domain.entity.FitbitTokenEntity
import com.example.wearable.trustapp.biowatcher.common.Constants.FITBIT_TOKEN_TABLE

@Dao
interface FitbitTokenDao {
    @Query("SELECT * FROM $FITBIT_TOKEN_TABLE $ORDER_BY")
    fun getAll(): List<FitbitTokenEntity>

    // dateより前のデータを取得(文字列の比較であることに注意。yyyy/MM/dd形式で比較すること)
    @Query(
        "SELECT * FROM $FITBIT_TOKEN_TABLE WHERE client_id = :clientId $ORDER_BY"
    )
    fun findByClientId(clientId: String): FitbitTokenEntity

    @Insert
    suspend fun add(encryptData: FitbitTokenEntity)

    @Delete
    suspend fun delete(encryptData: FitbitTokenEntity)

    @Query("DELETE FROM $FITBIT_TOKEN_TABLE")
    suspend fun deleteAll()

    @Update
    suspend fun update(encryptData: FitbitTokenEntity)

    private companion object {
        const val ORDER_BY = " ORDER BY id, client_id, updated_at"
    }
}
