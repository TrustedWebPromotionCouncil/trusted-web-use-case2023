package com.example.wearable.trustapp.biowatcher.infrastructure.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import com.example.wearable.trustapp.biowatcher.common.Constants.ROOM_BOOLEAN_FALSE
import com.example.wearable.trustapp.biowatcher.common.Constants.ROOM_BOOLEAN_TRUE
import com.example.wearable.trustapp.biowatcher.domain.entity.StudySubjectEntity
import com.example.wearable.trustapp.biowatcher.common.Constants.STUDY_SUBJECT_TABLE

@Dao
interface StudySubjectDao {
    @Query("SELECT * FROM $STUDY_SUBJECT_TABLE $ORDER_BY")
    fun getAll(): List<StudySubjectEntity>

    @Query(
        "SELECT * FROM $STUDY_SUBJECT_TABLE WHERE study_subject_id = :studySubjectId $ORDER_BY"
    )
    fun findById(studySubjectId: Int): StudySubjectEntity

    @Query(
        "SELECT * FROM $STUDY_SUBJECT_TABLE WHERE study_subject_id = :studySubjectId AND is_valid = $ROOM_BOOLEAN_TRUE $ORDER_BY"
    )
    fun findByValidId(studySubjectId: Int): StudySubjectEntity

    @Insert
    suspend fun add(studySubject: StudySubjectEntity)
//    suspend fun add(heartRate: StudySubjectEntity)

    @Delete
    suspend fun delete(studySubject: StudySubjectEntity)

    @Query("DELETE FROM $STUDY_SUBJECT_TABLE")
    suspend fun deleteAll()

    // 無効データを削除
    @Query("DELETE FROM $STUDY_SUBJECT_TABLE WHERE study_subject_id = :studySubjectId AND is_valid = $ROOM_BOOLEAN_FALSE")
    suspend fun deleteByInvalid(studySubjectId: Int)

    @Update
    suspend fun update(studySubject: StudySubjectEntity)

    private companion object {
        const val ORDER_BY = " ORDER BY study_subject_id"
    }
}
