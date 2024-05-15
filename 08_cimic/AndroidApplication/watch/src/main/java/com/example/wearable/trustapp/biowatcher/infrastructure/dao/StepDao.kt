package com.example.wearable.trustapp.biowatcher.infrastructure.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.example.wearable.trustapp.biowatcher.domain.entity.Step
import com.example.wearable.trustapp.biowatcher.common.Constants.STEP_TABLE

@Dao
interface StepDao {
    @Query("SELECT * FROM $STEP_TABLE $ORDER_BY")
    fun getAll(): List<Step>

    @Query("SELECT * FROM $STEP_TABLE WHERE date = :date $ORDER_BY")
    fun findByDate(date: String): Step

    @Query("SELECT * FROM $STEP_TABLE WHERE date < :date $ORDER_BY")
    fun findBeforeDate(date: String): Step

    @Insert
    suspend fun addStep(vararg step: Step)

    @Delete
    suspend fun deleteStep(vararg step: Step)

    @Query("DELETE FROM $STEP_TABLE")
    suspend fun deleteAllSteps()

    @Query("DELETE FROM $STEP_TABLE WHERE date = :date")
    suspend fun deleteStepsByDate(date :String)

    @Update
    suspend fun updateBook(step: Step)

    private companion object {
        const val ORDER_BY = " ORDER BY date"
    }

}
