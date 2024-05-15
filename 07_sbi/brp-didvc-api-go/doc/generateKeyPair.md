

# PublicKeyとPrivateKeyを作成するAPIについて

Key Pairを作成するために使用されます。

## リクエスト

- HTTP Method: POST
- Endpoint: api/generateKeyPair/{:keyName}

## レスポンス
keyNameに該当するPublicKey（MultiBaseのBase58BTC）が含まれるJSON文字列で応答します。

#### レスポンスボディ
JSONオブジェクトのレスポンスボディには、以下のプロパティが含まれます：

- publicKeyMultibase：MultiBase（Base58BTC）化されたPublicKeyの文字列。

レスポンスボディの例：

```
{
   "publicKeyMultibase":"z8EZHLVhRfHU2gyDZHcYArqcQD1XyWVRn45gBFTtdWDq4"
}
```

## エラー

以下のエラーレスポンスが返される場合があります：

- 400 Bad Request - keyNameの命名ルールに違反した場合。
```
{
  "error": "Bad request. KeyName is a string that starts with a lowercase letter and includes alphanumeric characters, hyphens, and underscores."
}
```

- 500 Internal Server Error - KeyPair生成時、もしくは、KeyPairをAWS Secrets Managerへ登録sる際に、Errorが発生した場合。

エラーレスポンスの例：
```
{
  "error": "error details."
}
```

