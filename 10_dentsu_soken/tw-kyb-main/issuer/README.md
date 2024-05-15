ローカルサーバー起動手順
===========================================

1. Dev Containerを開く
2. resources/authlete.propertiesに適切なアクセストークンを設定
```
service.access_token = アクセストークン
```
3. 以下のコマンドを実行
```
sh /workspace/shells/dev.sh
```

デプロイ手順
===========================================

1. Dev Containerを開く
2. 以下のコマンドでGCPにログイン
```
gcloud auth login
```
3. resources/authlete.propertiesに適切なアクセストークンを設定
```
service.access_token = アクセストークン
```
4. 以下のコマンドを実行してデプロイ
```
sh /workspace/shells/deploy.sh
```