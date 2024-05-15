# VC作成APIについて

VCを発行するために使用されます。
必要な情報を含むJSONリクエストを受け取り、発行されたVCをJSONレスポンスとして返します。

## リクエスト

- HTTP Method: POST
- Endpoint: api/vc
- Content Type: application/json

#### リクエストボディ

> **注意:<br>1.レスポンスヘッダがapplication/vc+ld+json＆application/vp+ld+jsonにしていない。<br>2.ld定義との一致検証を行なっていない**

JSONオブジェクトのリクエストボディには、以下のプロパティが必要となります。

- keyName（文字列、必須）：使用するKeyPairを指定。
- vcID（文字列、必須）：VCのID。
- issuerID（文字列、必須）：VCの発行者のID。
- issuerName（文字列、必須）：VCの発行者の名前。
- validFrom（文字列、オプション）：VCの有効期間開始日。指定しない場合、現在の日時が使用されます。
- validUntil（文字列、オプション）：VCの有効期間終了日。指定しない場合、現在の日付から1年後がデフォルト値として使用されます。
- credentialSubject（オブジェクト、必須）：証明書の内容を表すJSONオブジェクト。

#### リクエストボディの例(JSON整形ずみ)：

<details>
<summary>Click to Expand/Collapse JSON</summary>

```json
{
  "keyName": "AuthOrgKeyName",
  "vcID": "vcID00001",
  "issuerID": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
  "issuerName": "JP Digital Certificate Organization 1",
  "credentialSubject": {
    "didDocument": {
      "@context": "https://w3id.org/did/v1",
      "id": "did:example:GUi5XHMycjqd1pe",
      "verificationMethod": [
        {
          "type": "Ed25519VerificationKey2018",
          "controller": "did:example:GUi5XHMycjqd1pe",
          "id": "did:example:GUi5XHMycjqd1pe#AuthOrgKeyName",
          "publicKeyMultibase": "z8kic8KKvRiYk11FXUk85TPaG39VnZiwe9uumsYyy1x62"
        }
      ]
    },
    "authenticatorInfo": {
      "digitalCertificateOrganizationName": "JP Digital Certificate Organization 1",
      "digitalCertificateOrganizationCredentialIssuer": "JP Accreditation Organization"
    },
    "businessUnitInfo": {
      "businessUnitName": "factorya",
      "country": "Japan",
      "address": "1-6-1 Roppongi, Minato-ku, Tokyo",
      "contactPerson": "Ohtani Shohei",
      "contactNumber": "0312345678"
    },
    "legalEntityInfo": {
      "legalEntityIdentifier": "6010401045208",
      "legalEntityName": "SBI Holdings",
      "location": "Tokyo"
    },
    "authenticationLevel": "1",
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "challenge": "OiwieoNoibT57GHJokGUYTFipio@ONJ",
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
          "id": "d3c3c3f8-968c-407e-9814-352038a43269",
          "type": [
            "VerifiableCredential"
          ],
          "credentialSubject": {
            "blockHash": "A5864EB94E00E4C611ADDBC2640F6217A681861388B541D044F0DCA65BE080AC",
            "didDocument": {
              "@context": "https://w3id.org/did/v1",
              "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
              "verificationMethod": [
                {
                  "type": "Ed25519VerificationKey2018",
                  "controller": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
                  "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#AuthOrgKeyName",
                  "publicKeyMultibase": "z8YdBNxmCRxKUr3WrUNxV1Ut9jdmVtcqPCdxfibX4kbrP"
                }
              ]
            },
            "uuid": "0a4255c7-8109-4424-8476-dd653c1e0b60"
          },
          "issuer": {
            "id": "did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ",
            "name": "JP Accreditation Organization"
          },
          "validFrom": "2023-09-15T17:42:32+09:00",
          "validUntil": "2033-09-15T17:42:32+09:00",
          "proof": {
            "type": "Ed25519Signature2018",
            "created": "2023-09-15T08:42:32Z",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ#AuthOrgKeyName",
            "signatureValue": "......"
          }
        }
      ],
      "proof": [
        {
          "type": "Ed25519Signature2018",
          "created": "2023-09-26T17:38:01+09:00",
          "proofPurpose": "authentication",
          "verificationMethod": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#AuthOrgKeyName",
          "signatureValue": "......"
        }
      ]
    }
  }
}
```
</details>

## レスポンス
VCのJSON文字列で応答します。

#### レスポンスボディ
JSONオブジェクトのレスポンスボディには、下記の順番にプロパティが含まれます：

- context（文字列の配列）：VCのコンテキスト。関連するJSON-LDコンテキストURLを含める必要があります。
- id（文字列）：VCのID。
- type（文字列の配列）：VCのタイプ。
- credentialSubject（オブジェクト）：証明書の内容。
- issuer（オブジェクト）：VCの発行者（発行者のIDと、発行者の名前）。
- validFrom（文字列）：VCの有効期間開始日。
- validUntil（文字列）：VCの有効期間終了日。
- proof（オブジェクト）：プルーフ情報。

> **注意:**
credentialSubject内の項目の並び順が変えられないです。

Proof（オブジェクト）には、以下のプロパティが含まれます：

- type（文字列）：プルーフのタイプ。
- created（文字列）：プルーフの作成日時。
- proofPurpose（文字列）：プルーフの目的。
- verificationMethod（文字列）：プルーフに使用される検証方法。
- signatureValue（文字列）：プルーフの署名値。

> **注意:**
署名（signatureValue）する対象はレスポンスボディからProofを除いたJsonの文字列（整形せず）です。

#### レスポンスボディの例(JSON整形ずみ)：

<details>
<summary>Click to Expand/Collapse JSON</summary>

```
{
  "@context": [
    "https://www.w3.org/2018/credentials/v2"
  ],
  "id": "vcID00001",
  "type": [
    "VerifiableCredential"
  ],
  "credentialSubject": {
    "didDocument": {
      "@context": "https://w3id.org/did/v1",
      "id": "did:example:GUi5XHMycjqd1pe",
      "verificationMethod": [
        {
          "type": "Ed25519VerificationKey2018",
          "controller": "did:example:GUi5XHMycjqd1pe",
          "id": "did:example:GUi5XHMycjqd1pe#AuthOrgKeyName",
          "publicKeyMultibase": "z8kic8KKvRiYk11FXUk85TPaG39VnZiwe9uumsYyy1x62"
        }
      ]
    },
    "authenticatorInfo": {
      "digitalCertificateOrganizationName": "JP Digital Certificate Organization 1",
      "digitalCertificateOrganizationCredentialIssuer": "JP Accreditation Organization"
    },
    "businessUnitInfo": {
      "businessUnitName": "factorya",
      "country": "Japan",
      "address": "1-6-1 Roppongi, Minato-ku, Tokyo",
      "contactPerson": "Ohtani Shohei",
      "contactNumber": "0312345678"
    },
    "legalEntityInfo": {
      "legalEntityIdentifier": "6010401045208",
      "legalEntityName": "SBI Holdings",
      "location": "Tokyo"
    },
    "authenticationLevel": "1",
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "challenge": "OiwieoNoibT57GHJokGUYTFipio@ONJ",
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
          "id": "d3c3c3f8-968c-407e-9814-352038a43269",
          "type": [
            "VerifiableCredential"
          ],
          "credentialSubject": {
            "blockHash": "A5864EB94E00E4C611ADDBC2640F6217A681861388B541D044F0DCA65BE080AC",
            "didDocument": {
              "@context": "https://w3id.org/did/v1",
              "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
              "verificationMethod": [
                {
                  "type": "Ed25519VerificationKey2018",
                  "controller": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
                  "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#AuthOrgKeyName",
                  "publicKeyMultibase": "z8YdBNxmCRxKUr3WrUNxV1Ut9jdmVtcqPCdxfibX4kbrP"
                }
              ]
            },
            "uuid": "0a4255c7-8109-4424-8476-dd653c1e0b60"
          },
          "issuer": {
            "id": "did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ",
            "name": "JP Accreditation Organization"
          },
          "validFrom": "2023-09-15T17:42:32+09:00",
          "validUntil": "2033-09-15T17:42:32+09:00",
          "proof": {
            "type": "Ed25519Signature2018",
            "created": "2023-09-15T08:42:32Z",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ#AuthOrgKeyName",
            "signatureValue": "......"
          }
        }
      ],
      "proof": [
        {
          "type": "Ed25519Signature2018",
          "created": "2023-09-26T17:38:01+09:00",
          "proofPurpose": "authentication",
          "verificationMethod": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#AuthOrgKeyName",
          "signatureValue": "......"
        }
      ]
    }
  },
  "issuer": {
    "id": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
    "name": "JP Digital Certificate Organization 1"
  },
  "validFrom": "2023-09-26T17:38:11+09:00",
  "validUntil": "2024-09-26T17:38:11+09:00",
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2023-09-26T17:38:11+09:00",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D#AuthOrgKeyName",
    "signatureValue": "......"
  }
}
```

</details>

## エラー

以下のエラーレスポンスが返される場合があります：

- 400 Bad Request - 必要なフィールドが欠けている場合。
```
{
  "error": "Bad request."
}
```

- 400 Bad Request - 下記項目に中括弧が入っている場合
　
  - keyName
  - vcID
  - issuerID
  - issuerName
  - validFrom
  - validUntil
  
```
{
  "error": "Curly bracket was found."
}
```

- 404 Not Found - プライベートキーが見つからない場合。
```
{
  "error": "Private key not found in AWS Secrets Manager."
}
```

- 500 Internal Server Error - JSONエンコード、JSONデコード、マルチベースデコード、マルチベースエンコードのいずれかでエラーが発生した場合。

エラーレスポンスの例：
```
{
  "error": "Error Happened in the function of MultiBase Decode."
}
```

