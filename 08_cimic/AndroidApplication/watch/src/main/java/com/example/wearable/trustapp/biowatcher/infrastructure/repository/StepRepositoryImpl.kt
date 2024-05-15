package com.example.wearable.trustapp.biowatcher.infrastructure.repository

import com.example.wearable.trustapp.biowatcher.infrastructure.dao.StepDao
import com.example.wearable.trustapp.biowatcher.domain.entity.Step
import com.example.wearable.trustapp.biowatcher.domain.repository.StepRepository
import javax.inject.Inject

class StepRepositoryImpl @Inject constructor(
    private val stepDao : StepDao,
) : StepRepository
{
    override fun getAll() = stepDao.getAll()
    override fun findByDate(date: String) = stepDao.findByDate(date)
    override fun findBeforeDate(date: String) = stepDao.findBeforeDate(date)
    override suspend fun add(step: Step) = stepDao.addStep(step)
    override suspend fun delete(step: Step) = stepDao.deleteStep(step)
    override suspend fun deleteAll() = stepDao.deleteAllSteps()
    override suspend fun deleteByDate(date: String) = stepDao.deleteAllSteps()
    override suspend fun update(step: Step) = stepDao.updateBook(step)
}