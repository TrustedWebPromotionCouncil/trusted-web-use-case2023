# **認証機構(失効管理体)用のVC発行に関連するAPI**

### **エンドポイント1: `POST /brp/corda/vc-json`**

- 説明: リクエストパラメータに基づいてVCを生成。
- Role制限：　失効管理体　OR　認証機構
- HTTPメソッド: POST
- リクエストボディ:
  - タイプ: JSON（公的機関名、VCのID、有効期間（秒単位））
  - 例:
  ```json
      
    {
    "authOrgName": "VCAuthOrg",
    "vcID": "VCAuthOrgConsortium000002-vcID001",
    "validityPeriod": 31536000
    }
  ```
- [→DID命名と関連するGolang内部API](https://github.com/brp-project/brp-didvc-api-go/pull/6/files#diff-a03d9af26dfdf60af47f36b9001f5a7dc4d5ca1c9fb28eed43f1077f939de21f)
- レスポンスボディ:
  - タイプ: VCのJson
  - 例: 
  
  ```json
  {
     "@context":[
        "https://www.w3.org/2018/credentials/v2"
     ],
     "id":"VCAuthOrgConsortium000002-vcIDTest001",
     "type":[
        "VerifiableCredential"
     ],
     "credentialSubject":{
        "blockHash":"FD20B44BAA28031320E2A46FB4D9A33D4BFD110698DFB4C4F3AD2453A13DCBF8",
        "didDocument":{
           "@context":"https://w3id.org/did/v1",
           "id":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D",
           "verificationMethod":[
              {
                 "controller":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D",
                 "id":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D#vcauth-consortium2-key",
                 "publicKeyMultibase":"z2zMuJ87g76DJ3ot7BaTLBwVt44fnkw6mtUQLrH5cJHJL",
                 "type":"Ed25519VerificationKey2018"
              }
           ]
        },
        "uuid":"3ac32eaa-c6a4-4c05-9bc3-061d8f1ee467"
     },
     "issuer":{
        "id":"did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ",
        "name":"JP Accreditation Organization"
     },
     "validFrom":"2023-07-28T10:19:55+09:00",
     "validUntil":"2024-07-27T10:19:55+09:00",
     "proof":{
        "type":"Ed25519Signature2018",
        "created":"2023-07-28T01:19:55Z",
        "proofPurpose":"assertionMethod",
        "verificationMethod":"did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ#vcauth-org-key",
        "signatureValue":"... 省略 ..."
     }
  }
  
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていないRoleです。
  - 500 Internal Server Error: Cordaの例外が発生しました。

### **エンドポイント2: `GET /brp/corda/vc-json-list`**

- 説明: VC(JSONデータ)リストを取得。
- Role制限：　失効管理体　OR　認証機構
- HTTPメソッド: GET
- レスポンスボディ:
  - タイプ: VC（JSON）の一覧
  - 例:

  ```json
  [
     {
        "@context":[
           "https://www.w3.org/2018/credentials/v2"
        ],
        "id":"VCAuthOrgConsortium000002-vcIDTest001",
        "type":[
           "VerifiableCredential"
        ],
        "credentialSubject":{
           "blockHash":"FD20B44BAA28031320E2A46FB4D9A33D4BFD110698DFB4C4F3AD2453A13DCBF8",
           "didDocument":{
              "@context":"https://w3id.org/did/v1",
              "id":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D",
              "verificationMethod":[
                 {
                    "controller":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D",
                    "id":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D#vcauth-consortium2-key",
                    "publicKeyMultibase":"z2zMuJ87g76DJ3ot7BaTLBwVt44fnkw6mtUQLrH5cJHJL",
                    "type":"Ed25519VerificationKey2018"
                 }
              ]
           },
           "uuid":"3ac32eaa-c6a4-4c05-9bc3-061d8f1ee467"
        },
        "issuer":{
           "id":"did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ",
           "name":"JP Accreditation Organization"
        },
        "validFrom":"2023-07-28T10:19:55+09:00",
        "validUntil":"2024-07-27T10:19:55+09:00",
        "proof":{
           "type":"Ed25519Signature2018",
           "created":"2023-07-28T01:19:55Z",
           "proofPurpose":"assertionMethod",
           "verificationMethod":"did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ#vcauth-org-key",
           "signatureValue":"... 省略 ..."
        }
     },
     {
        "@context":[
           "https://www.w3.org/2018/credentials/v2"
        ],
        "id":"VCAuthOrgConsortium000002-vcID001",
        "type":[
           "VerifiableCredential"
        ],
        "credentialSubject":{
           "blockHash":"8ECB5DEB4E98E5421CD3A55F5AFDA6C1E34F2E3F640B2266B0920C0F3CF24E6A",
           "didDocument":{
              "@context":"https://w3id.org/did/v1",
              "id":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D",
              "verificationMethod":[
                 {
                    "controller":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D",
                    "id":"did:detc:JPVCRevocationControlOrganization2:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnQ29uc29ydGl1bTAwMDAwMiwgTD1Ub2t5bywgQz1KUA%3D%3D#vcauth-consortium2-key",
                    "publicKeyMultibase":"z2zMuJ87g76DJ3ot7BaTLBwVt44fnkw6mtUQLrH5cJHJL",
                    "type":"Ed25519VerificationKey2018"
                 }
              ]
           },
           "uuid":"33a69893-5c3b-4e79-9c81-6bb5199c41d6"
        },
        "issuer":{
           "id":"did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ",
           "name":"JP Accreditation Organization"
        },
        "validFrom":"2023-07-20T19:06:24+09:00",
        "validUntil":"2023-07-27T19:06:24+09:00",
        "proof":{
           "type":"Ed25519Signature2018",
           "created":"2023-07-20T10:06:24Z",
           "proofPurpose":"assertionMethod",
           "verificationMethod":"did:detc:JPAccreditationOrganization:T1U9QXV0aERlcHQsIE89VkNBdXRoT3JnLCBMPVRva3lvLCBDPUpQ#vcauth-org-key",
           "signatureValue":"... 省略 ..."
        }
     }
  ]
  ```

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていない役割です。
  - 500 Internal Server Error: Cordaの例外が発生しました。

### **エンドポイント3: `GET /brp/corda/vc-json-list-for-auth-consortium`**

- 説明: 失効管理体用のVC（JSONデータ）リストを取得。
- Role制限：　公的機関
- HTTPメソッド: GET
- レスポンスボディ:
  - タイプ: VC（JSON）の一覧
  - 例:　vc-json-listの例を参考

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていない役割です。
  - 500 Internal Server Error: Cordaの例外が発生しました。

### **エンドポイント4: `GET /brp/corda/vc-json-list-for-auth-company`**

- 説明: 認証機構用のVC（JSONデータ）リストを取得。
- Role制限：　公的機関
- HTTPメソッド: GET
- レスポンスボディ:
  - タイプ: VC（JSON）の一覧
  - 例:　vc-json-listの例を参考

- ステータスコード:
  - 200 OK: リクエストが成功しました。
  - 401 Unauthorized: 期待されていない役割です。
  - 500 Internal Server Error: Cordaの例外が発生しました。

### Corda X500名称からDID Issuer Nameへの変換について
使用しているCorda X500名称については、以下のようにDID Issuer Nameへ変換されます。
```
/* JP */
"OU=AuthDept, O=VCAuthOrg, L=Tokyo, C=JP"                 -> "JP Accreditation Organization"
"OU=AuthDept, O=VCAuthOrgConsortium000001, L=Tokyo, C=JP" -> "JP VC Revocation Control Organization 1"
"OU=AuthDept, O=VCAuthOrgConsortium000002, L=Tokyo, C=JP" -> "JP VC Revocation Control Organization 2"
"OU=AuthDept, O=VCAuthCom1, L=Tokyo, C=JP"                -> "JP Digital Certificate Organization 1"
"OU=AuthDept, O=VCAuthCom2, L=Tokyo, C=JP"                -> "JP Digital Certificate Organization 2"
/* TW */
"OU=AuthDept, O=VCAuthOrg, L=Taipei, C=TW"                 -> "TW Accreditation Organization"
"OU=AuthDept, O=VCAuthOrgConsortium000001, L=Taipei, C=TW" -> "TW Revocation Administration Service 1"
"OU=AuthDept, O=VCAuthOrgConsortium000002, L=Taipei, C=TW" -> "TW Revocation Administration Service 2"
"OU=AuthDept, O=VCAuthCom1, L=Taipei, C=TW"                -> "TW Digital Certificate Organization 1"
"OU=AuthDept, O=VCAuthCom2, L=Taipei, C=TW"                -> "TW Digital Certificate Organization 2"
```
