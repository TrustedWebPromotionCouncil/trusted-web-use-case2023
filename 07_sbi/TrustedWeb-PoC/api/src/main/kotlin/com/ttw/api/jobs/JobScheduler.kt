package com.ttw.api.jobs

import com.ttw.api.infrastructure.repositories.AuthChallengeRepository
import io.ktor.server.application.*
import kotlinx.coroutines.*
import org.slf4j.LoggerFactory
import kotlin.time.Duration.Companion.days

object JobScheduler {

    private val logger = LoggerFactory.getLogger(javaClass)

    private val jobs = mutableListOf<Job>()

    fun start() {
        jobs += cleanExpiredRequestId()
    }

    fun stop() {
        jobs.forEach {
            it.cancel()
        }
    }

    private fun cleanExpiredRequestId(): Job {
        return CoroutineScope(Dispatchers.Default).launch {
            while (true) {
                logger.info("有効期限切れのリクエストIDを削除します")
                AuthChallengeRepository.deleteExpired()
                logger.info("有効期限切れのリクエストIDの削除が完了しました")
                delay(1L.days)
            }
        }
    }
}

fun Application.configureJob() {
    JobScheduler.start()
    environment.monitor.subscribe(ApplicationStopping) {
        JobScheduler.stop()
    }
}
