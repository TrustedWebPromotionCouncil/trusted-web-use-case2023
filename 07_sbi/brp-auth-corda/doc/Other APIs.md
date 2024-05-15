# **その他のAPI**

### **エンドポイント1: `GET /brp/corda/get-corda-network-info`**

- 説明: Cordaネットワーク内のすべてのノードのCorda Identityを取得します。
- HTTPメソッド: GET
- レスポンスボディ:
  - タイプ: 文字列のリスト
  - 例:
  ```json
    [
    "id: [OU=AuthDept, O=VCAuthOrgConsortium000002, L=Tokyo, C=JP]",
    "id: [OU=Notary1, O=SbiR3Japan, L=Tokyo, C=JP, OU=Notary, O=SbiR3Japan, L=Tokyo, C=JP]",
    "id: [OU=AuthDept, O=VCAuthOrg, L=Tokyo, C=JP]",
    "id: [OU=AuthDept, O=VCAuthCom2, L=Tokyo, C=JP]",
    "id: [OU=AuthDept, O=VCAuthCom1, L=Tokyo, C=JP]",
    "id: [OU=AuthDept, O=VCAuthOrgConsortium000001, L=Tokyo, C=JP]"
    ]   
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。

### **エンドポイント2: `GET /brp/corda/get-my-identity`**

- 説明: 呼び出し元ノードのX500組織名を取得します。
- HTTPメソッド: GET
- レスポンスボディ:
  - タイプ: 文字列
  - 例: "VCAuthOrgConsortium000002"
- ステータスコード:
  - 200 OK: リクエストが成功しました。

### **エンドポイント3: `GET /brp/corda/get-my-role`**

- 説明: 呼び出し元ノードのRoleを取得します
- (例、 公的機関：AUTH_ORG、失効管理体：AUTH_ORG_CONSORTIUM、認証機構：AUTH_COMPANY)。
- HTTPメソッド: GET
- レスポンスボディ:
  - タイプ: 文字列
  - 例: "AUTH_ORG_CONSORTIUM"
- ステータスコード:
  - 200 OK: リクエストが成功しました。