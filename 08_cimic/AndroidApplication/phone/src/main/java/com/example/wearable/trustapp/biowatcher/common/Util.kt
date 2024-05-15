package com.example.wearable.trustapp.biowatcher.common

import android.util.Log
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException


class Util {
    companion object {
        val TAG = "Util"

        fun getToday(): LocalDateTime {
            return LocalDateTime.now()
        }

        fun isValidResponseJsonString(jsonString: String): Boolean {
            return !(jsonString == "[]" || jsonString == "[{}]" || jsonString == "" || jsonString == "{}")
        }

        // yyyy/MM/dd HH:mm:ss
        fun getTodayDateTime(today: LocalDateTime): String {
            val formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss")
            return today.format(formatter)
        }
        fun getBeforeMonthDate(today: LocalDateTime, months : Long): LocalDateTime {
            return today.minusMonths(months)
        }

        fun convertIsoOffSetDateTimeToString(todayString: String): String {
            return try {
                val newFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME
                val parsedDate = LocalDateTime.parse(todayString, newFormatter)

                val formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss")
                parsedDate.format(formatter)
            } catch (e: Exception) {
                Log.d("Util", "getDateTime: $e")
                ""
            }
        }

        // ハイフン付きの日付文字列であるかをを判定する
        fun isValidDateString(date: String, conStr: String = "-"): Boolean {
            // yyyy-MM-dd形式の文字列かどうかをチェックする
            if (!isDateFormatValid(date, conStr)) {
                return false
            }

            try {
                val formatter = DateTimeFormatter.ofPattern("yyyy${conStr}MM${conStr}dd")
                LocalDate.parse(date, formatter)
            } catch (e: DateTimeParseException) {
                return false
            }
            return true
        }

        private fun isDateFormatValid(date: String, conStr: String = "-"): Boolean {
            // yyyy-MM-dd形式の文字列かどうかをチェックする
            val regex = Regex("""\d{4}$conStr\d{2}$conStr\d{2}""")
            return regex.matches(date)
        }

        fun getStringOfYYYYMMDD(today: LocalDateTime): String {
            val formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd")
            return today.format(formatter)
        }

        // 日付形式の文字列を別の日付形式の文字列に変換する(例：yyyy-MM-dd形式の文字列をyyyy/MM/dd形式の文字列に変換する)
        fun convertDateStringFormat(
            today: String,
            oldValue: String = "/",
            newValue: String = "-"
        ): String {
            return today.replace(oldValue, newValue)
        }

        fun getBufferSize(fileSize: Long): Int {
            val bufferSize = when {
                fileSize <= Constants.FILE_SIZE_1K -> Constants.BUFFER_SIZE_FOR_LESS_1K // 1KB以下の場合
                fileSize <= Constants.FILE_SIZE_1K_1M -> Constants.BUFFER_SIZE_FOR_LESS_1M // 1KBから1MBの間の場合
                else -> Constants.BUFFER_SIZE_FOR_OVER_1M // 1MB以上の場合
            }
            return bufferSize
        }

        // YYYYMMDD形式の文字列に変換する
        fun toYYYYMMDDString(date: LocalDate): String {
            return date.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"))
        }
        fun toYYYYMMDDHHMMSSString(dateTime: LocalDateTime): String {
            return dateTime.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
        }

        fun toYYYYMMDDString(date: String): String {
            var str = ""
            try {
                str = if (date != "") {
                    date.substring(0, 10).replace("-", "/")
                } else {
                    "-"
                }
            } catch (e: Exception) {
                Log.d("Util", "toYYYYMMDDString: $e")
            }
            return str
        }

        fun toYYYYMMDDString(year: String, month: String, day: String): String {
            val yyyy = if (year.length == 2) "20$year" else year
            val mm = if (month.length == 1) "0$month" else month
            val dd = if (day.length == 1) "0$day" else day

            return "$yyyy/$mm/$dd"
        }

        // 文字列をデコードしてMap<String, String>にする
        inline fun <reified T> jsonDecode(jsonString: String): T {
            val json = Json {
                ignoreUnknownKeys = true
            }
            return json.decodeFromString(jsonString)
        }

        // エンコードして文字列にする
        inline fun <reified T> jsonEncode(value: T): String {
            val json = Json {
                ignoreUnknownKeys = true
            }
            return json.encodeToString(value)
        }

        fun getDateFromStartToEnd(value: LocalDate, value1: LocalDate): List<String> {
            val dateList = mutableListOf<String>()
            var date = value
            while (date <= value1) {
                dateList.add(toYYYYMMDDString(date))
                date = date.plusDays(1)
            }
            return dateList
        }
    }
}




