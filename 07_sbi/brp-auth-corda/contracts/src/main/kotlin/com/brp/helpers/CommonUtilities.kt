package com.brp.helpers

import co.paralleluniverse.fibers.Suspendable
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*


object CommonUtilities {
    const val datePattern = "yyyy-MM-dd'T'HH:mm:ssXXX"

    @Suspendable
    fun dateToStr(date: Date): String {
        //20191025T030930Z
        val df = SimpleDateFormat(datePattern)
        return df.format(date)
    }

    @Suspendable
    fun strToDate(str: String?): Date? {
        if (str == null) return Date()

        val sdFormat = try {
            SimpleDateFormat(datePattern)
        } catch (e: IllegalArgumentException) {
            null
        }
        val date = sdFormat?.let {
            try {
                it.parse(str)
            } catch (e: ParseException) {
                null
            }
        }
        return date
    }

    @Suspendable
    fun afterYears(date: Date, year: Int): Date{
        val cal = Calendar.getInstance()
        cal.time = date
        cal.add(Calendar.YEAR, year)
        return cal.time
    }

    @Suspendable
    fun afterSeconds(date: Date, seconds: Int): Date{
        val cal = Calendar.getInstance()
        cal.time = date
        cal.add(Calendar.SECOND, seconds)
        return cal.time
    }
}