

# Defaultで作成されたKeyの名称（keyName）を取得するAPIについて

API起動時に、（Dockerの）環境変数「AuthOrgKeyName」にて指定した値で、Default用のKey Pairが作成される。
その環境変数の値を取得するために使用されます。

> **注意:**
API名に「4AuthOrg」が入っている経緯としては、認証機構用VC発行の機能実装にあたって、そのAPIが作成されたためである。将来的に、keyName4AuthOrgをdefaultKeyNameに変更する予定がある。

## リクエスト

- HTTP Method: GET
- Endpoint: api/keyName4AuthOrg

## レスポンス
keyNameを指定する環境変数の値（String）が含まれるJSON文字列で応答します。
Defaultの値は"AuthOrgKeyName"である。

#### レスポンスボディ
JSONオブジェクトのレスポンスボディには、以下のプロパティが含まれます：

- keyName：文字列。

レスポンスボディの例：

```
{"keyName":"AuthOrgKeyName"}
```


## Defaultで作成したKeyの名称一覧
```
In Japan Env:
vcauth-bu2-key
vcauth-bu1-key
vcauth-consortium2-key
vcauth-consortium1-key
vcauth-com2-key
vcauth-com1-key
vcauth-org-key

In TW Env:
vcauth-tw-bu2-key
vcauth-tw-bu1-key
vcauth-tw-consortium2-key
vcauth-tw-consortium1-key
vcauth-tw-com2-key
vcauth-tw-com1-key
vcauth-tw-org-key
```
