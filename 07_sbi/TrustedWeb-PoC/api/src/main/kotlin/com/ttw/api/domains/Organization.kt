package com.ttw.api.domains

enum class Organization(val label: String) {
    AUTHORITY_1("authority-1"),
    REVOKE_1("revoke-1")
    ;

    override fun toString(): String {
        return label
    }

    companion object {
        fun of(label: String): Organization? {
            return entries.find { it.label == label }
        }
    }
}
