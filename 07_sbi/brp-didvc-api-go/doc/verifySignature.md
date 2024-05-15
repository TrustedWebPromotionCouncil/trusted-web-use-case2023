# 作成したVC/VPの検証のためのバックエンドAPIについて

署名の正当性検証に使用されます。
必要な情報を含むJSONリクエストを受け取り、検証結果をJSONレスポンスとして返します。

## リクエスト

- HTTP Method: POST
- Endpoint: api/verifySignature
- Content Type: application/json

#### リクエストボディ

JSONオブジェクトのリクエストボディには、以下のプロパティが必要となります。

- publicKeyMultibase（文字列、必須）： MultiBase化されたPublicKeyの文字列。
- signatureValue（文字列、必須）： 署名値。
- verifiableObject（オブジェクト、必須）： 署名対象。　例：proof項目なしのVCとVP。

#### リクエストボディの例(JSON整形ずみ)：

<details>
<summary>Click to Expand/Collapse JSON</summary>

```
{
  "publicKeyMultibase": "z8YdBNxmCRxKUr3WrUNxV1Ut9jdmVtcqPCdxfibX4kbrP",
  "signatureValue": "...省略...",
  "verifiableObject": {
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
    "validUntil": "2033-09-15T17:42:32+09:00"
  }
}
```

</details>

## レスポンス
検証結果をJSON文字列で応答します。

#### レスポンスボディ

  - タイプ: JSON（result: Valid or Invalid）
  - 例:

  ```json
  {
  "result": "Valid"
  }
  ```

## エラー

以下のエラーレスポンスが返される場合があります：

- 400 Bad Request - 必要なフィールドが欠けている場合。
```
{
  "error": "Bad request."
}
```

- 500 Internal Server Error - JSONエンコード、JSONデコード、マルチベースデコード、マルチベースエンコードのいずれかでエラーが発生した場合。

エラーレスポンスの例：
```
{
  "error": "Error Happened in the function of MultiBase Decode."
}
```

