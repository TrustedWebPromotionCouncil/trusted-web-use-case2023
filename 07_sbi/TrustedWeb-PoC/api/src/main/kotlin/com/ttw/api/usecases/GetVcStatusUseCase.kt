package com.ttw.api.usecases

import com.ttw.api.domains.Organization
import com.ttw.api.infrastructure.services.JsonSerializer
import com.ttw.api.infrastructure.services.VcStatusProvider
import org.slf4j.LoggerFactory

object GetVcStatusUseCase {
    private val logger = LoggerFactory.getLogger(javaClass)

    suspend fun handle(
        uuid: String,
        organization: Organization,

    ): VcStatusOutput {
        // CordaにVC状態(uuid単位)を取得に行く
        val vcStatus = VcStatusProvider.getStatusByUuid(uuid)

        // 失効機関のVC、VPを取得 TODO

        return VcStatusOutput(
            uuid = uuid,
            status = vcStatus
        )
    }

    // TODO　失効機関のVC取得
    private val VcValue = """
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v2"
          ],
          "id": "http://example.com/vc/3732",
          "type": [
            "VerifiableCredential"
          ],
          "credentialSubject": {
            "didDocument": {
              "@context": "https://w3id.org/did/v1",
              "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
              "verificationMethod": [
                {
                  "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#key002",
                  "type": "Ed25519VerificationKey2018",
                  "controller": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
                  "publicKeyMultibase": "zHCZ1b2vYXZEy459jVHMm6Hkie4czj4dYMgV2DrajtsG8"
                }
              ]
            },
            "levelOfAuth": "level1",
            "statusOfAuth": "Valid",
            "linkedVP": "{}"
          },
          "issuer": {
            "id": "did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ",
            "name": "JP Accreditation Organization"
          },
          "validFrom": "2023-06-06T13:18:01+09:00",
          "validUntil": "2024-06-06T13:18:01+09:00",
          "proof": {
            "type": "Ed25519Signature2018",
            "created": "2023-06-06T13:18:01+09:00",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ#key1",
            "signatureValue": "z43x4oHeLaBDyRiNfYVTKMgUKDv3ntfNYkpSxsj9USfq7WhPGc3eu9kFx5oxXM9Yg4rG7D5ejDCpQ9rUajW2YehyY"
          }
        }
    """.trimIndent().let {
        JsonSerializer.deserialize<Map<*, *>>(it)
    }

    // TODO VPは固定ではなく発行することになる予定
    private val linkedVpValue = """
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v2"
          ],
          "id": "vpID000001",
          "holder": "did:example:User1",
          "type": [
            "VerifiablePresentation"
          ],
          "verifiableCredential": [
            {
              "@context": [
                "https://www.w3.org/2018/credentials/v2"
              ],
              "id": "http://example.com/vc/3732",
              "type": [
                "VerifiableCredential"
              ],
              "credentialSubject": {
                "didDocument": {
                  "@context": "https://w3id.org/did/v1",
                  "id": "did:example:User1",
                  "verificationMethod": [
                    {
                      "id": "did:example:User1#key1",
                      "type": "Ed25519VerificationKey2018",
                      "controller": "did:example:User1",
                      "publicKeyMultibase": "z2NiACPW6h8wvLWEo6pXPSsbU1HYSBXvKxQipYG4hTHcd"
                    }
                  ]
                },
                "levelOfAuth": "level1",
                "statusOfAuth": "Valid",
                "linkedVP": {
                  "@context": [
                    "https://www.w3.org/2018/credentials/v2"
                  ],
                  "id": "vpID000001",
                  "holder": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
                  "type": [
                    "VerifiablePresentation"
                  ],
                  "verifiableCredential": [
                    {
                      "@context": [
                        "https://www.w3.org/2018/credentials/v2"
                      ],
                      "id": "http://example.com/vc/3732",
                      "type": [
                        "VerifiableCredential"
                      ],
                      "credentialSubject": {
                        "didDocument": {
                          "@context": "https://w3id.org/did/v1",
                          "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
                          "verificationMethod": [
                            {
                              "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#key002",
                              "type": "Ed25519VerificationKey2018",
                              "controller": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
                              "publicKeyMultibase": "zHCZ1b2vYXZEy459jVHMm6Hkie4czj4dYMgV2DrajtsG8"
                            }
                          ]
                        },
                        "levelOfAuth": "level1",
                        "statusOfAuth": "Valid",
                        "linkedVP": "{}"
                      },
                      "issuer": {
                        "id": "did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ",
                        "name": "JP Accreditation Organization"
                      },
                      "validFrom": "2023-06-06T13:18:01+09:00",
                      "validUntil": "2024-06-06T13:18:01+09:00",
                      "proof": {
                        "type": "Ed25519Signature2018",
                        "created": "2023-06-06T13:18:01+09:00",
                        "proofPurpose": "assertionMethod",
                        "verificationMethod": "did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ#key1",
                        "signatureValue": "z43x4oHeLaBDyRiNfYVTKMgUKDv3ntfNYkpSxsj9USfq7WhPGc3eu9kFx5oxXM9Yg4rG7D5ejDCpQ9rUajW2YehyY"
                      }
                    }
                  ],
                  "proof": [
                    {
                      "type": "Ed25519Signature2018",
                      "created": "2023-06-21T11:23:29+09:00",
                      "proofPurpose": "authentication",
                      "verificationMethod": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#key002",
                      "signatureValue": "zNToUW6dJJVeCMf52PPzXaS8sGYaMVSJCg546kcWMpm7cyyHDXRmTKyKypV1PomnCd84k65hH6axT6UTxvoYF1LR"
                    }
                  ]
                }
              },
              "issuer": {
                "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
                "name": "JP Digital Certificate Organization 1"
              },
              "validFrom": "2023-06-06T13:18:01+09:00",
              "validUntil": "2024-06-06T13:18:01+09:00",
              "proof": {
                "type": "Ed25519Signature2018",
                "created": "2023-06-06T13:18:01+09:00",
                "proofPurpose": "assertionMethod",
                "verificationMethod": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#key002",
                "signatureValue": "z2F7oPjRiRYiHHyd9AvRzjrqNpUPgz7ynqHtxTY4bV6imZXYMVxL6tjvoYbydyXLpBmLaoWScZkuQua8KnksSniUN"
              }
            }
          ],
          "proof": [
            {
              "type": "Ed25519Signature2018",
              "created": "2023-06-21T11:23:29+09:00",
              "proofPurpose": "authentication",
              "verificationMethod": "did:example:User1#key1",
              "signatureValue": "z2N1jDjEChTZ2nfPMXnGg7vPFDFJuUs59oZv8brJRp4F7eewWdXRgsbtxg2rjFEi5tvaUBmqPizigDUV4kvtKJ9a7"
            }
          ]
        }
    """.trimIndent().let {
        JsonSerializer.deserialize<Map<*, *>>(it)
    }
}

data class VcStatusOutput(
    val uuid: String,
    val status: String
)