# 変換後のDIDフォーマットの文字列からX500名へ戻すAPIについて

変換後のDIDフォーマットの文字列からX500名へ戻すため、
- １。"%02X"化された下記の３文字をBase64用の文字列へ戻す
  - '+' => %2B
  - '/' => %2F
  - '=' => %3D
- ２。Base64化の文字列からX500名へ戻す

## リクエスト

- HTTP Method: POST
- Endpoint: api/didStringToX500Name
- Content Type: application/json

#### リクエストボディ

JSONオブジェクトのリクエストボディには、以下のプロパティが必要となります。

- reqString（文字列、必須）：変換後のDIDフォーマットの文字列を指定。


#### リクエストボディの例：

```
{
  "reqString": "T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ"
}
```

## レスポンス
X500名で応答します。

#### レスポンスボディ
JSONオブジェクトのレスポンスボディには、以下のプロパティが含まれます：

- resString: X500名の文字列

レスポンスボディの例：

```
{
  "resString":"OU=AuthDept, O=VCAuthOrg, L=Tokyo, C=JP"
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

- 500 Internal Server Error - Base64デコードでエラーが発生した場合。
```
{
  "error": "Error Happened in the function of Base64 Decode."
}
```

