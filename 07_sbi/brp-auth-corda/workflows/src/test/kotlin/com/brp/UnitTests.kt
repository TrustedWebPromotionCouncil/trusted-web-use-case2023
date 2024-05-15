package com.brp

import com.brp.helpers.CommonUtilities
import com.brp.helpers.CordaUtility
import org.apache.logging.log4j.Level
import org.apache.logging.log4j.core.config.Configurator
import org.junit.Before
import org.junit.Test
import java.util.*


class UnitTests {

    @Before
    fun setup() {
        Configurator.setAllLevels("", Level.ERROR)
    }

    @Test
    fun test1() {
       val nodeName = CordaUtility.strToX500Name("O=CertAuthCom1,OU=DataCenter,L=Tokyo,C=JP")
        println(CordaUtility.x500NameToStr(nodeName))
    }

    @Test
    fun test2() {
        val dateString = CommonUtilities.dateToStr(CommonUtilities.afterYears(Date(),1))
        println("dateToStr: $dateString")
        println("strToDate: ${CommonUtilities.strToDate(dateString)}")
    }

    @Test
    fun test3() {
        val dateString = CommonUtilities.dateToStr(CommonUtilities.afterYears(Date(),1))
        println("dateToStr: $dateString")
        println("strToDate: ${CommonUtilities.strToDate(dateString)}")
    }
}