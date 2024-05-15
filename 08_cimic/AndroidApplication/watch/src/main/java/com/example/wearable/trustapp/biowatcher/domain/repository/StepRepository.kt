package com.example.wearable.trustapp.biowatcher.domain.repository

import com.example.wearable.trustapp.biowatcher.domain.entity.Step

interface StepRepository {
    fun getAll(): List<Step>
    fun findByDate(date: String): Step
    fun findBeforeDate(date: String): Step
    suspend fun add(step: Step)

    suspend fun delete(step: Step)
    suspend fun deleteAll()
    suspend fun deleteByDate(date: String)
    suspend fun update(step: Step)
}