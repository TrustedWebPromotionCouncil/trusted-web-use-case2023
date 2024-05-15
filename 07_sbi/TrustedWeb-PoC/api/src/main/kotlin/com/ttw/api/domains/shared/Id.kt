package com.ttw.api.domains.shared

import java.util.*

abstract class Id(val value: String) {
    override fun toString(): String {
        return "${this::class.simpleName}[$value]"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Id

        if (value != other.value) return false

        return true
    }

    override fun hashCode(): Int {
        return value.hashCode()
    }

    protected companion object {
        // IDはUUIDバージョン4とする
        fun generateIdValue(): String = UUID.randomUUID().toString()
    }
}
