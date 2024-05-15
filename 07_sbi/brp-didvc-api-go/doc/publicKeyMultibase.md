

# PublicKey（MultiBaseのBase58BTC）取得APIについて

PublicKeyを取得するために使用されます。

## リクエスト

- HTTP Method: GET
- Endpoint: api/publicKeyMultibase/{:keyName}

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

- 404 Not Found - キーが見つからない場合。
```
{
  "error": "Public key not found in AWS Secrets Manager."
}
```

