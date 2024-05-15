# 患者・被験者アプリケーション

## 概要

本アプリケーションでは、治験参加者(以下、被験者)が自分のデータを管理するためのDID を作成し、被験者自身のデータを暗号化・復号化することで安全にデータを管理します。被験者は各試験・病院施設と説明同意プロセスを通じて、暗号化したデータを被験者が信頼した医療機関に提供することができます。

このドキュメントは、「患者・被験者アプリケーション」の開発環境構築手順、ビルド手順、実行手順を記載しています。
連携するアプリケーションは以下の通りです。

- phone ：スマートフォン用アプリケーション(以下、phone用アプリ)
- watch ：スマートウォッチ(TicWatch E3)用アプリケーション(以下、watch用アプリ)
  
## 要件

本プロジェクトは Android用のkotlinで書かれており、本アプリを構築してデプロイするにはAndroid StudioとAndroid SDK が必要です。他のすべての要件は Gradle によって自動的に処理されます。

## ビルド環境

    ・AndroidStudioバージョン：Android Studio Hedgehog | 2023.1.1 Patch 2
    ・kotlin バージョン	：1.8.20
    ・KeychainCOREバージョン ： 2.4.10
    
    [注意事項]
    本アプリケーションでは、コアとなるKeychainCOREモジュールは契約上機密事項のため公開ファイルには含まれておりません。  
    ビルドに必要なKeychainCOREモジュールの使用については、別途Keychain社との契約が必要となります。

## プロジェクトの構築

本アプリケーションを構築して実行するには、次の手順に従ってください。

1. Android Studioでプロジェクトを開きます。  
2. Android SDK がシステム上に見つからない場合、Android Studio はそれを選択するかダウンロードするように求めるメッセージを表示します。  

## Ticwatch E3 心拍数データの取得
本アプリケーションでは、Ticwatch E3の心拍数データを取得することが可能です。  

*[前提条件]  
TIcWatch E3とスマートフォンを事前に連携しスマートフォンにphone用アプリ、TIcWatch E3にwatch用アプリをインストールする必要があります。  
※TIcWatch E3とスマートフォンの連携方法に関しては、以下のサイトをご参照ください。  
https://support.google.com/wearos/answer/6056630?hl=ja&co=GENIE.Platform%3DAndroid*


## Fitbit 心拍数データの取得

本アプリケーションでは、Fitbit WEB APIを利用してFitbitデバイスの心拍数データを取得することが可能です。  
WEB APIの利用には、下記の事前準備が必要となります。

    1. Fitbitアカウントの作成
    2. Web APIを利用するアプリ情報の登録
    ※個人データの取得のため、"Personal" アプリケーションタイプを選択してください。
    3. アクセストークン・リフレッシュトークン等の取得
      
    上記の詳細な手順については、Fitbitの公式サイトを参照してください。  

WEB APIが利用できる状態になったら、上記1-3にて取得した値を`gradle.properties` ファイルの以下の項目に設定してください。

- FITBIT_USER_ID : FitbitのUSER ID
- FITBIT_CLIENT_ID_01 : FitbitアプリのOAuth 2.0 Client ID
- FITBIT_CLIENT_SECRET_01 : FitbitアプリのClient Secret
- FITBIT_AUTH_CODE_01 : FitbitアプリのAuthorization Code
- FITBIT_ACCESS_TOKEN_01 : Fitbitアプリのアクセストークン
- FITBIT_REFRESH_TOKEN_01 : Fitbitアプリのリフレッシュトークン

## BOX APIの設定

本アプリケーションでは、BOX APIを利用してBox(クラウドストレージ)に文書ファイルをアップロードします。  
BOX APIの利用に必要な情報を、`gradle.properties` ファイルの以下の項目に設定してください。

- BOX_CLIENT_ID : BOX APIのクライアントID
- BOX_CLIENT_SECRET : BOX APIのクライアントシークレット
- BOX_USER_ID : BOX APIのユーザーID

*[前提条件]  
暗号化されたファイルのやり取りに使用するクラウドストレージとしてBoxを利用しており、アクセスするためには別途契約が必要となります。  
BOXの利用・契約に関しては、以下のサイトをご参照ください。  
https://www.box.com/ja-jp/home*

## Trusted Directory管理用アプリケーションの設定

本アプリケーションでは、本アプリのデータと各アプリ間のデータを連携するためのサーバー(Trusted Directory管理用アプリ)を設置している。
管理者アプリのURLを`gradle.properties` ファイルの以下の項目に設定してください。

- TD_SERVER_URL : Trusted Directory管理用アプリのURL
