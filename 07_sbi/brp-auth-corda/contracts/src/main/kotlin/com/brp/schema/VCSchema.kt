package com.brp.schema

import com.brp.helpers.ConstVariables
import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState

import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Index
import javax.persistence.Table


// *********
// * Schema *
// *********

/**
 * The family of schemas for VCState.
 */
object VCSchema

/**
 * An VCState schema.
 */
object VCSchemaV1 : MappedSchema(
    schemaFamily = VCSchema.javaClass,
    version = 1,
    mappedTypes = listOf(PersistentVC::class.java)) {

    @Entity
    @Table(name = "vc_state",
        indexes = [
            Index(name = "vc_tb_auth_company_x509_name", columnList = "auth_company_x509_name"),
            Index(name = "vc_tb_linear_id", columnList = "linear_id")
        ]
    )
    class PersistentVC(
        @Column(name = "auth_company_x509_name")
        var authCompanyX500Name: String,

        @Column(name = "status")
        var status: String,

        @Column(name = "updated_time")
        var updatedTime: Date,

//        @Type(type = "uuid-char")
        @Column(name = "linear_id")
        var linearId: String
    ) : PersistentState() {
        // Default constructor required by hibernate.
        constructor(): this("", ConstVariables.VCValidStatus, Date(),"")
    }
}