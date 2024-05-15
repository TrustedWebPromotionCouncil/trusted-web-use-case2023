package com.ttw.api.testutils

import com.github.tomakehurst.wiremock.WireMockServer
import io.kotest.core.TestConfiguration
import io.kotest.extensions.wiremock.ListenerMode
import io.kotest.extensions.wiremock.WireMockListener
import java.net.InetAddress
import java.net.ServerSocket

object TestUtils {

    fun freePort(): Int {
        val localhost = InetAddress.getByName("localhost")
        return (1024..65535).first { i ->
            runCatching {
                ServerSocket(i, 1, localhost).close()
            }.fold(
                onSuccess = { true },
                onFailure = { false }
            )
        }
    }

    fun TestConfiguration.registerListener(listenerMode: ListenerMode = ListenerMode.PER_TEST): Pair<WireMockServer, Int> {
        val port = freePort()
        val server = WireMockServer(port)
        register(WireMockListener(server, listenerMode))

        return server to port
    }
}
