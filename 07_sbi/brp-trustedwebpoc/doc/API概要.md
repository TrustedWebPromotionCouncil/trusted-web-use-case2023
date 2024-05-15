<!--外部相対リンク定義-->


# API概要

## DID/VCに関する主要なAPI

### main API
[内部でDIDが使用する鍵を新規構築するAPI](../../brp-didvc-api-go/doc/generateKeyPair.md).  
[署名つきのVerifiable Credentialを生成するAPI](../../brp-didvc-api-go/doc/vc.md).  
[Verifiable Credential/Veriable Presentationの署名検証するAPI](../../brp-didvc-api-go/doc/verifySignature.md).  
[署名つきのVerifiable Presentationを生成するAPI](../../brp-didvc-api-go/doc/vp.md).  
[複数のVCを含めたVerifiable Presentationを生成するAPI](../../brp-didvc-api-go/doc/vp4MultiVCs.md).  

### ヘルパー API
[X500名をDIDフォーマットの文字列へ変換するAPI](../../brp-didvc-api-go/doc/didStringFromX500Name.md).  
[DIDフォーマットをX500へ変換するAPI](../../brp-didvc-api-go/doc/didStringToX500Name.md)　　   
[DefaultのKeyNameを取得するAPI](../../brp-didvc-api-go/doc/keyName4AuthOrg.md)　　   
[KeyNameに紐づく公開鍵を取得するAPI](../../brp-didvc-api-go/doc/publicKeyMultibase.md).  　　

### ソースコードリポジトリ
[DID/VCに関するソースコードリポジトリ](../../brp-didvc-api-go/)