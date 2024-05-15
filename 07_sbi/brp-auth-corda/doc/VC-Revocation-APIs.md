# **事業所用VCの失効管理に関連するAPI**

### **エンドポイント1: `POST /brp/corda/revocation/vc`**

- 説明: 事業所用VCに使用するUUIDを発番
- Role制限：　認証機構
- HTTPメソッド: POST
- リクエストボディ: なし

- レスポンスボディ:
  - タイプ: JSON（blockHashとuuid）
  - 例: 
  
  ```json
  {
  "blockHash": "431773379474AC97AC38A742A0174A299F33460F7F6DE29E4E9D379BD0D148E5",
  "uuid": "5d052bcf-97a4-45a5-9072-36a9c5b84bad"
  }
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていないRoleです。
  - 500 Internal Server Error: Cordaの例外が発生しました。


### **エンドポイント２: `DELETE /brp/corda/revocation/vc/:uuid`**

- 説明: UUIDで指定された事業所用VCを失効させる
- Role制限：　認証機構
- HTTPメソッド: DELETE
- リクエストボディ: なし

- レスポンスボディ:
  - タイプ: JSON（blockHash）
  - 例:

  ```json
  {
  "blockHash": "431773379474AC97AC38A742A0174A299F33460F7F6DE29E4E9D379BD0D148E5"
  }
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていないRoleです。
  - 500 Internal Server Error: Cordaの例外が発生しました。

### **エンドポイント３: `PUT /brp/corda/revocation/vc/:uuid`**

- 説明: UUIDで指定された事業所用VCを失効させ、新UUIDを発番
- Role制限：　認証機構
- HTTPメソッド: PUT
- リクエストボディ: なし

- レスポンスボディ:
  - タイプ: JSON（blockHashとuuid）
  - 例:

  ```json
  {
  "blockHash": "431773379474AC97AC38A742A0174A299F33460F7F6DE29E4E9D379BD0D148E5",
  "uuid": "5d052bcf-97a4-45a5-9072-36a9c5b84bad"
  }
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていないRoleです。
  - 500 Internal Server Error: Cordaの例外が発生しました。

### **エンドポイント４: `GET /brp/corda/revocation/vc-status/:uuid`**

- 説明: UUIDで指定された事業所用VCの状態を取得
- Role制限：　失効管理体
- HTTPメソッド: GET
- リクエストボディ: なし

- レスポンスボディ:
  - タイプ: JSON（status: Valid or Revoked or Unknown）
  - 例:

  ```json
  {
  "status": "Revoked"
  }
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていないRoleです。
  - 500 Internal Server Error: Cordaの例外が発生しました。

### **エンドポイント５: `GET /brp/corda/revocation/vc-valid-list`**

- 説明: 有効の事業所用VC（UUID）の一覧を取得
- Role制限：　失効管理体　OR　認証機構
- HTTPメソッド: GET
- リクエストボディ: なし

- レスポンスボディ:
  - タイプ: JSON（uuid）のリスト
  - 例:

  ```json
  [
    {
      "uuid": "5d052bcf-97a4-45a5-9072-36a9c5b84b01"
    },
    {
      "uuid": "5d052bcf-97a4-45a5-9072-36a9c5b84b02"
    }
  ]
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていないRoleです。
  - 500 Internal Server Error: Cordaの例外が発生しました。

### **エンドポイント６: `GET /brp/corda/revocation/vc-revoked-list`**

- 説明: 失効ずみの事業所用VC（UUID）の一覧を取得
- Role制限：　失効管理体　OR　認証機構
- HTTPメソッド: GET
- リクエストボディ: なし

- レスポンスボディ:
  - タイプ: JSON（uuid）のリスト
  - 例:

  ```json
  [
    {
      "uuid": "5d052bcf-97a4-45a5-9072-36a9c5b84b03"
    },
    {
      "uuid": "5d052bcf-97a4-45a5-9072-36a9c5b84b04"
    }
  ]
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていないRoleです。
  - 500 Internal Server Error: Cordaの例外が発生しました。