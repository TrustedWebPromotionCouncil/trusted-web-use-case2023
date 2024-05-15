# X500名をDIDフォーマットの文字列へ変換するAPIについて

X500名をDIDフォーマットの文字列へ変換するため、
- １。X500名をBase64化
- ２。Base64に使用される下記の３文字を"%02X"化
  - '+' => %2B
  - '/' => %2F
  - '=' => %3D

## リクエスト

- HTTP Method: POST
- Endpoint: api/didStringFromX500Name
- Content Type: application/json

#### リクエストボディ

JSONオブジェクトのリクエストボディには、以下のプロパティが必要となります。

- reqString（文字列、必須）：X500名の文字列を指定。


#### リクエストボディの例：

```
{
  "reqString": "OU=AuthDept, O=VCAuthOrg, L=Tokyo, C=JP"
}
```

## レスポンス
変換後のDIDフォーマットの文字列で応答します。

#### レスポンスボディ
JSONオブジェクトのレスポンスボディには、以下のプロパティが含まれます：

- resString: 変換後のDIDフォーマットの文字列

レスポンスボディの例：

```
{
  "resString":"T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ"
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


