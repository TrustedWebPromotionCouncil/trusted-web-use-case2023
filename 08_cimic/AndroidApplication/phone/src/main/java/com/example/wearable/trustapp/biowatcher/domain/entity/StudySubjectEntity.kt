package com.example.wearable.trustapp.biowatcher.domain.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.wearable.trustapp.biowatcher.common.Constants.STUDY_SUBJECT_TABLE
import kotlinx.serialization.Serializable

// 試験病院-被験者
@Serializable
@Entity(tableName = STUDY_SUBJECT_TABLE)
data class StudySubjectEntity(
    @PrimaryKey(autoGenerate = true)
    var id: Int,

    // studysubjects(ID)
    @ColumnInfo(name = "study_subject_id")
    val studySubjectId: Int,
    @ColumnInfo(name = "is_valid")
    var isValid: Boolean = true,
    @ColumnInfo(name = "created_at")
    val createdAt: String,  // 作成日
    @ColumnInfo(name = "updated_at")
    var updatedAt: String,  // 更新日
)
