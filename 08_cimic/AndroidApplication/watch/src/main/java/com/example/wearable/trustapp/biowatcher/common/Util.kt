package com.example.wearable.trustapp.biowatcher.common

import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

public class Util {
    companion object {
        fun getToday(): LocalDateTime {
            return LocalDateTime.now()
        }
        fun getBeforeMonthDate(today: LocalDateTime, months : Long): LocalDateTime {
            return today.minusMonths(months)
        }

        // yyyy/MM/dd HH:mm:ss
        fun getTodayDateTime(today: LocalDateTime): String {
            val formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss")
            return today.format(formatter)
        }

        fun getStringOfYYYYMMDD(today: LocalDateTime): String {
            val formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd")
            return today.format(formatter)
        }

        fun getTodayTimeHour(today: LocalDateTime): String {
            val today = LocalDateTime.now()
            val formatter = DateTimeFormatter.ofPattern("HH")
            return today.format(formatter)
        }

        fun getTodayTimeMinute(today: LocalDateTime): String {
            val today = LocalDateTime.now()
            val formatter = DateTimeFormatter.ofPattern("mm")
            return today.format(formatter)
        }

        // 文字列をデコードしてMap<String, String>にする
        fun jsonDecode(jsonString: String): Map<String, String> {
            return Json.decodeFromString<Map<String, String>>(jsonString)
        }

        // エンコードして文字列にする
        inline fun <reified T> jsonEncode(value: T): String {
            return Json.encodeToString(value)
        }
    }
}