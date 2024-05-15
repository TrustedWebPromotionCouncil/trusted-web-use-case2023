package com.ttw.api.infrastructure.models

import com.ttw.api.infrastructure.services.JsonSerializer
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.json.json
import java.time.LocalDateTime

object AuthChallenges : Table("auth_challenge") {
  val authId: Column<String> = varchar("auth_id", 128)

  val challenge: Column<String> = varchar("challenge", 128)

  val expiredAt: Column<LocalDateTime> = datetime("expired_at")

  override val primaryKey: PrimaryKey = PrimaryKey(authId)
}

object BusinessVcRequests : Table("business_vc_request") {
  val requestId: Column<String> = varchar("request_id", 128)

  val uuid: Column<String> = varchar("uuid", 36)

  val receivedVc: Column<Map<*, *>> = json("received_vc", { JsonSerializer.serialize(it) }, { JsonSerializer.deserialize(it) })

  val createdAt: Column<LocalDateTime> = datetime("created_at")

  val organization: Column<String> = varchar("organization", 128)

  val linkedVp: Column<Map<*, *>> = json("linked_vp", { JsonSerializer.serialize(it) }, { JsonSerializer.deserialize(it) })

  val signedVc: Column<Map<*, *>?> = json<Map<*, *>>("signed_vc", { JsonSerializer.serialize(it) }, { JsonSerializer.deserialize(it) }).nullable()

  override val primaryKey: PrimaryKey = PrimaryKey(requestId)
}
