package com.example.wearable.trustapp.biowatcher.infrastructure.repository

import com.example.wearable.trustapp.biowatcher.infrastructure.dao.StudySubjectDao
import com.example.wearable.trustapp.biowatcher.domain.entity.StudySubjectEntity
import com.example.wearable.trustapp.biowatcher.domain.repository.StudySubjectRepository

class StudySubjectRepositoryImpl(
    private val studySubjectDao: StudySubjectDao,
) : StudySubjectRepository
{
    override suspend fun getAll(): List<StudySubjectEntity> = studySubjectDao.getAll()
    override fun findBySubjectId(studySubjectId: Int) = studySubjectDao.findById(studySubjectId)
    override fun findByValidSubjectId(studySubjectId: Int) = studySubjectDao.findByValidId(studySubjectId)
    override suspend fun add(studySubject: StudySubjectEntity) = studySubjectDao.add(studySubject)
//    override suspend fun add(studySubject: StudySubjectEntity) = StudySubjectDao.add(studySubject)
    override suspend fun delete(studySubject: StudySubjectEntity) = studySubjectDao.delete(studySubject)
    override suspend fun deleteAll() = studySubjectDao.deleteAll()
    override suspend fun deleteByInvalid(studySubjectId: Int) = studySubjectDao.deleteByInvalid(studySubjectId)
    override suspend fun update(studySubject: StudySubjectEntity) = studySubjectDao.update(studySubject)
}