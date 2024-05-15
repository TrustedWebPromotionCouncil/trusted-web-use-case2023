
このリポジトリは Trusted Webのデモ用 Web Interface App 開発用とする。

## プログラム構成

### ディレクトリ構成

  提供するプログラムで動作確認する際に関係する主要なディレクトリは以下の通り。
```
  ディレクトリ名  説明
  /web          WEB実装方式サンプル(事業所/デジタル認証機構/失効管理サービス/公的機関)を
                格納しているディレクトリ
  /api          事業所向けAPIを格納しているディレクトリ
  /env          環境設定ファイル等を格納しているディレクトリ
  /openapi      OPENAPI定義
```

### コンテナ構成

  プログラムはDockerを前提に提供している。以下、動作確認する際に関係する主要なコンテナは以下の通り。
```
  コンテナ名    説明
  ttw-web      WEB実装方式サンプル http://localhost:3001で稼働
  ttw-api      事業所向けAPI http://localhost:8086で稼働
  ttw-pg       WEB実装方式サンプルで利用するデータベース 5432ポートで稼働
                ※接続方法は以下参照
  ttw-openapi  事業所向けAPIのAPI定義 http://localhost:8081で稼働
```

## 環境構築手順

### 前提条件

- 本プログラムはDocker上で動作するイメージ形式である。
- gitをインストールしておく。
- 動作させるにあたってメモリは最低1GB以上割り当てが必要。
- ネットワークに接続している状態であること。
  - また、プログラム内部でCordaに接続するが通信上の制約(ファイアウォール等)は事前に排除しておく事。


### 手順

#### １．github より対象一式をダウンロード
 `git clone https://github.com/brp-project/TrustedWeb-PoC.git`

#### ２．TrustedWeb-PoCフォルダに移動
  git clone したフォルダにTrustedWeb-PoCフォルダが出来るのでそこへ移動。

#### ３．設定変更
  本プログラムは日本用の認証局のUAT環境として設定済の状態であるが台湾用のUAT設定も提供している。
  
  台湾用のUAT環境にしたい場合には以下のスクリプトを実行する。

  <Linux環境の場合>
  
   `$ chgenv.sh <jp/tw> `

  <Windows環境の場合>
  
   `> chgenv.bat <jp/tw> `

  - 引数twは台湾用の環境を意味する。
  - env配下に、台湾/日本用の設定ファイルと共に既存の設定ファイルを.bakを付与して保存する。
  - bakアップファイルは1世代のみで、上書きするので注意。
  - "$"はシェルを意味しており実行するコマンドは$の右側の文字列(以下同)。

#### ４．基本設定以外の設定可能項目
  基本設定以外の設定可能項目に関しては「TTW-ConfigrationDefinitionDocument.xlsx」を参照。

#### ５．Dockerの起動

  ＜バックグラウンド実行（任意）＞
  
  `$ docker compose up -d`
  
  ＜Docker起動時のログを記録（任意）＞
  
  `$ docker compose up >>docker.log`

  - 起動時間 約15分
  - docker composeコマンドはオプション-dをつけない場合であっても即時終了する。
  - 起動処理の終了を確認する場合は以下の通り、WEBサーバの起動ログが出力されていることを確認する。

  ＜WEBサービスの起動完了ログ＞
  
  `Remix App Server started at http://localhost:3000 (http://"実行環境のIPアドレス":3000)`



#### ６．起動時のエラー対応

  - TTW-APIが起動失敗
    - エラーメッセージ
      - `/__cacert_entrypoint.sh: line 30: /opt/TrustedWeb-PoC/api/gradlew: cannot execute: required file not found`
    - エラー原因
      - WindowsPCでgit cloneをする時、複数のgradleファイルの改行コードがCRLFになっているため発生したエラー。
    - 対応方法
      - 対象ファイルに対し、CRLFになってるファイルはLFに変更する。
    - 対象ファイル
      - ...TrustedWeb-PoC\api\gradlew
      - ...TrustedWeb-PoC\api\gradle.properties
      - ...TrustedWeb-PoC\api\gradle\wrapper\gradle-wrapper.properties
        
#### ７．Dockerの停止

  `$ docker compose down`

  - オプション-dをつけないで実行した場合はCtrl+c実行後、docker compose downを実行すること。
  

## デジタル認証基盤の初回作業
  - 新規に構築されたCordaを使用する場合のみ、デジタル認証機構と失効管理サービスのVC発行を行う必要がある。
  - VC発行はCorda APIに対しcurlコマンドを発行する事で可能。

  サンプルコマンド
  
  デジタル認証機構（日本）のVC発行申請のコマンド
    
    curl -X POST http://uat.detc.link:8088/brp/corda/vc-json -H 'Content-Type: application/json' -d '{"authOrgName": "VCAuthOrg","vcID": "VCAuthCom1-vcID001","validityPeriod": 31536000}' 

  失効管理サービス（日本）のVC発行申請のコマンド
    
    curl -X POST http://uat.detc.link:8086/brp/corda/vc-json -H 'Content-Type: application/json' -d '{"authOrgName": "VCAuthOrg","vcID": "VCAuthOrgConsortium000001-vcID001","validityPeriod": 31536000}' 

  デジタル認証機構（台湾）のVC発行申請のコマンド
    
    curl -X POST http://uat-tw.detc.link:8088/brp/corda/vc-json -H 'Content-Type: application/json' -d '{"authOrgName": "VCAuthOrg","vcID": "VCAuthCom1-vcID001","validityPeriod": 31536000}' 

  失効管理サービス（台湾）のVC発行申請のコマンド
    
    curl -X POST http://uat-tw.detc.link:8086/brp/corda/vc-json -H 'Content-Type: application/json' -d '{"authOrgName": "VCAuthOrg","vcID": "VCAuthOrgConsortium000001-vcID001","validityPeriod": 31536000}' 

  サンプルコマンド解説(デジタル認証機構)
  ```
    リクエスト送信先：
      デジタル認証機構か失効管理サービス用CordaのURLおよびポート番号を指定

    リクエストメソッド：POST
    リクエスト形式：json
    リクエストボディ：
      {
         "authOrgName": "VCAuthOrg",        公的機関名
          "vcID": "VCAuthCom1-vcID001",      VCのID(管理体での採番ルール)
          "validityPeriod": 31536000        有効期間(秒)
      }
   ```

  詳細は以下のURL参照
    https://github.com/brp-project/brp-auth-corda/blob/main/doc/VC-APIs.md



## 動作確認手順

#### １．Docker
  以下のコマンドでログの参照が可能、Errorという文字列が出ていなければ正常動作中。

  `$ docker logs <コンテナ名>`

  
  主なコンテナ名
  
  - web : ttw-web
  - api : ttw-api
  - db  : ttw-pg
  

  ※docker-compose.yamlのcontainer_name参照

#### ２．web
  Webブラウザで以下のURLにアクセスしサンプル画面のメニューが表示される場合は正常動作中。

  `http://localhost:3000`

  トップメニュー
  
  - Public Institutions                   公的機関サービスへ
  - Digital Certification Organizations   デジタル認証機構サービスへ
  - Revocation Control Organizations      失効管理体サービスへ
  - Businesses                            事業所サービスへ
  

  ログインアカウント
  
  - 公的機関： public1/pass
  - デジタル認証機構： authority1/pass
  - 失効機関：revoke1/pass
  - 事業所：business1/pass
  

  ※日本/台湾共通


#### ３．api
  - APIテスト用に 日本環境向けに`test_api.sh` を同胞している。
  - 以下のシェルがVPを作成できていれば正常動作。

  `$ test_api.sh <local/aws>`

  - 引数は実行する環境を示す。localはローカルPCでのdocker、awsはAWS上にある開発環境でのdockerで実行する。
  - `test.api.sh` の33行目で `credentialSubject` を書き換えることで、認証したいVCの内容を変更できる。


#### ４．db
  - Docker内部で動作するDB(postgreSQL)にアクセスする場合、以下のコマンドを実行する事で直接DBアクセスが可能。
  - データベース定義に関しては「TTW-DBDifinitionDocument.xlsx」参照
  
  `$ docker exec -it ttw-pg ash`
  
  DBへのアクセス
  `/# psql -U postgres`

  ※postgreSQLのコマンドに関しては割愛


  また、DB関連のツールでアクセスする場合は以下の設定値を利用の事。

  DB接続設定
  - サーバ名：localhost
  - DB名  ： ttw_dev
  - ポート番号：5432
  - ユーザーID:postgres
  - パスワード:postgres


## ご参考  プログラム構成(詳細)

コンテナ事に利用している技術要素とライブラリの依存関係を紹介する。

```
  コンテナ名    要素技術
  ttw-web      Dockerイメージ  node:20.2-alpine3.17
                 Node.jsのバージョン20.2を含むAlpine Linuxディストリビューション
                 ※詳細はDockerHubかdocker-compose.yaml記載内容を参照

               プログラム本体
                 remixを利用し構築、remixはJavaScriptやTypeScript(本プログラムはこちら)を使用して、
                 高度なウェブアプリケーションを構築するためのフレームワークでありReactをベースとしている。

               関連ライブラリ
                 利用しているライブラリ等は以下のファイルを参照
                 /web/package.json
```

```
  ttw-api      Dockerイメージ  eclipse-temurin:17-alpine
                 java SE Development Kit 17（JDK 17）を含むAlpine Linuxディストリビューション
                 ※詳細はDockerHubかdocker-compose.yaml記載内容を参照

               プログラム本体
                 Kotlin,Ktorを利用し構築

               関連ライブラリ
                 利用しているライブラリ等は以下のファイルを参照
                 /api/build.gradle.kts
```
```
  ttw-pg       Dockerイメージ  postgres:11-alpine
                 PostgreSQLのバージョン11を含むAlpine Linuxディストリビューション
                 ※詳細はDockerHubかdocker-compose.yaml記載内容を参照
```
```
  ttw-openapi  Dockerイメージ  redocly/redoc:latest
                 APIドキュメントを表示するためのReDoc(最新)を含むイメージ
```
