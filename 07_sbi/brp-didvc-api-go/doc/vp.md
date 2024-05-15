# VP作成APIについて

VPを作成するために使用されます。
必要な情報を含むJSONリクエストを受け取り、発行されたVPをJSONレスポンスとして返します。

## リクエスト

- HTTP Method: POST
- Endpoint: api/vp
- Content Type: application/json

#### リクエストボディ

> **注意:<br>1.レスポンスヘッダがapplication/vc+ld+json＆application/vp+ld+jsonにしていない。<br>2.ld定義との一致検証を行なっていない**

JSONオブジェクトのリクエストボディには、以下のプロパティが必要となります。

- keyName（文字列、必須）：使用するKeyPairを指定。
- vpID（文字列、必須）：VPのID。
- issuerID（文字列、必須）：VP発行者のID。
- VerifiableCredential（オブジェクト、必須）：VCのJSONオブジェクト。

#### リクエストボディの例(JSON整形ずみ)：

<details>
<summary>Click to Expand/Collapse JSON</summary>

```
{
  "keyName": "AuthOrgKeyName",
  "vpID": "vpID000001",
  "issuerID": "did:detc:JPDigitalCertificateOrganization1:T1U9QXV0aERlcHQsIE89VkNBdXRoQ29tMSwgTD1Ub2t5bywgQz1KUA%3D%3D",
  "verifiableCredential": {
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
}
```

</details>

## レスポンス
VPのJSON文字列で応答します。

#### レスポンスボディ
JSONオブジェクトのレスポンスボディには、下記の順番にプロパティが含まれます：

- context（文字列の配列）：VPのコンテキスト。関連するJSON-LDコンテキストURLを含める必要があります。
- id（文字列）：VPのID。
- holder（文字列）：VPの所有者（発行者）。
- type（文字列の配列）：VPのタイプ。
- verifiableCredential（オブジェクト）：VCの内容。
- proof（オブジェクト）：プルーフ情報。

> **注意:**
verifiableCredential内の項目の並び順は`vc.md`の`レスポンスボディ`を参照。

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
  - vpID
  - issuerID
  
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

