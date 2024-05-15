package com.example.wearable.trustapp.biowatcher.domain.repository

import com.example.wearable.trustapp.biowatcher.domain.entity.StudySubjectEntity

interface StudySubjectRepository {
    suspend fun getAll(): List<StudySubjectEntity>
    fun findBySubjectId(studySubjectId: Int): StudySubjectEntity
    fun findByValidSubjectId(studySubjectId: Int): StudySubjectEntity
    suspend fun add(studySubjectData: StudySubjectEntity)
//    suspend fun add(studySubjectData: StudySubjectEntity)
    suspend fun delete(studySubjectData: StudySubjectEntity)
    suspend fun deleteAll()
    suspend fun deleteByInvalid(studySubjectId: Int)
    suspend fun update(studySubjectEntity: StudySubjectEntity)
}