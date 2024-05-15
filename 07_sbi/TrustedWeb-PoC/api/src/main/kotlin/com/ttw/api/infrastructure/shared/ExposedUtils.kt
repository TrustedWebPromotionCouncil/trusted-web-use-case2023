package com.ttw.api.infrastructure.shared

import com.ttw.api.Config
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

object ExposedUtils {
    val database = Database.connect(
        url = Config.databaseUrl,
    )
}

suspend fun <T> dbQuery(block: suspend Transaction.() -> T): T {
    return newSuspendedTransaction(
        context = Dispatchers.IO,
        db = ExposedUtils.database,
        statement = block
    )
}
