# Trusted Directory管理用アプリケーション

## 概要

本アプリケーションでは、主に以下3つのデータを管理します。
- 本システムの利用者（病院スタッフ、製薬企業/CROスタッフ、患者/被験者）および患者/被験者が利用するウェアラブルデバイスの情報
- ウェアラブルデバイスで取得した患者/被験者のデータ
- 監査証跡

インターフェースは以下の通りです。
- 管理者用Webサイト: 管理者がデータの閲覧や編集を行う。
- Web API：病院スタッフ、製薬企業/CROスタッフのPCアプリや
患者/被験者のスマートフォンアプリおよびウェアラブルデバイスアプリが読み書きを行う。


## 動作環境

  - Python - 3.11.4
  - Django - 4.1.3
  - PostgreSQL (DB) - 16.0

## 設定

 /trusted-directory/croTrustedDirectory/settings.pyについて以下の通り修正してください。

### BOX API

本アプリケーションでは、BOX APIを利用してBox(クラウドストレージ)に文書ファイルをアップロードします。  
BOX APIの利用に必要な情報を、以下に設定してください。

```
# /trusted-directory/croTrustedDirectory/settings.py

CLIENT_ID = ''          # BOX アプリのクライアントIDを記載してください。
CLIENT_SECRET = ''  # BOX アプリのクライアントシークレットを記載してください。
BOX_USER=''              # BOX アプリのuserを記載してください。

```

### DjangoのSECRET_KEYを再作成

  - commandlineで以下を実行してください。

  ```
  python manage.py shell
  In [1]: from django.core.management.utils import get_random_secret_key
  In [2]: get_random_secret_key()  # 出力される文字列をコピー
  ```

  - 出力された文字列にペーストして下さい。
  
  ```

  # /trusted-directory/croTrustedDirectory/settings.py

  SECRET_KEY = ''  # 再生成して下さい。

  ```
　  

### 独自ドメイン

以下の 'example-site' を取得した独自ドメインに置き換えてください。


```
# /trusted-directory/croTrustedDirectory/settings.py

ALLOWED_HOSTS = ['localhost',
                 '127.0.0.1',
                 '10.0.2.2',
                 'example-site',
                 ]  # 取得した独自ドメインに修正してください。

INTERNAL_IPS = [ '127.0.0.1',
                 'example-site',
                 ]  # 取得した独自ドメインに修正してください。

CSRF_TRUSTED_ORIGINS = ['https://*.127.0.0.1',
                        'https://example-site'
                        ]  # 取得した独自ドメインに修正してください。

```

*[前提条件]  
暗号化されたファイルのやり取りに使用するクラウドストレージとしてBoxを利用しており、アクセスするためには別途契約が必要となります。  
BOXの利用・契約に関しては、以下のサイトをご参照ください。  
https://www.box.com/ja-jp/home*


### databaseの設定
databaseの設定値を以下のファイルに記入してください。

```
# /trusted-directory/croTrustedDirectory/settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',  
        'HOST': 'host',     # 適切な値に修正してください。
        'NAME': 'name',     # 適切な値に修正してください。
        'USER': 'user',     # 適切な値に修正してください。
        'PASSWORD':'pass',  # 適切な値に修正してください。
        'PORT': '5432'      # 適切な値に修正してください。
    },
}

```

## pip install

コマンドラインで以下を実行してください。

```
pip install -r requirements.txt
```

## データベースマイグレーション

コマンドラインで以下を実行してください。

```
python manage.py migrate crodirectory

python manage.py migrate croaudit

python manage.py migrate devicestorage

```


## 管理者用Webサイト （adminサイト）の初期設定

管理者が操作するインターフェースである管理者用WebサイトはDjangoの「admin サイト」で実装しています。
admin サイトの詳細については以下URLを参照してください。
https://docs.djangoproject.com/ja/3.2/ref/contrib/admin/

以下に管理者用Web Appの初期設定手順を記載します。
・ブラウザで以下にアクセスする。
https://example-site/admin/
（example-siteは取得したドメインに置き換えてください。）

・commandlineで以下を実行する。
python manage.py createsuperuser

・プロンプトが表示されたら、ユーザー名 (小文字、スペースなし)、電子メール アドレス、およびパスワードを入力し、superuserを作成する。

・ブラウザに戻ってsuperuserでログインする。

・ブラウザで以下にアクセスし、管理者をユーザーとして登録する。
example-site/admin/auth/user/add/

・管理者用Webサイトの使用方法については利用手順書を参照して下さい。


