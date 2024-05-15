# クライアントアプリケーション（CROおよび病院スタッフ）

## 実行モジュールインストーラーの生成

### ＜実行モジュールインストーラー生成環境前提条件＞

    OSバージョン             ：Microsoft Windows10
    .NETFrameworkバージョン ：4.8
    KeychainCOREバージョン　 ：2.4.2
    Visual Studioバージョン ：2019
    ソースプログラムにKeyChain関連ライブラリなどが含まれていること（納品物には含まれておりません）

### ＜実行モジュールインストーラー生成手順＞

1. 「Visual Studioを起動＞プロジェクトやソリューションを開く」で本アプリケーシンのソースプログラムを選択する
2. ソリューションPrototype02において右クリック＞追加＞新しいプロジェクトを選択
3. 「Setup Project」を選択して次へクリック
4. プロジェクト名「CTCHAIN-Prototype02」を入力して作成をクリック
5. CTCHAIN-Prototype02のプロパティを以下のように修正

       Author : CMIC HOLDINGS Co., Ltd.
       InstallAllUsers : True
       Manufacturer : CMIC HOLDINGS Co., Ltd.
       ProductName : CTCHAIN-Prototype02
       Title : CTCHAIN-Prototype02

6. File System on Target Machine＞Application Folderを右クリック＞Add＞プロジェクト出力を選択する
7. プロジェクト出力グループの追加ダイアログで「プライマリ出力」を選択し、構成「Release Any CPU」を選択しOKボタンをクリックする
8. File System on Target Machine＞User's Desktopを選択し、右ペインで右クリック＞新しいショートカットの作成を選択
9. Select Item in Projectダイアログで「Look inでApplication Folder」を選択、「プライマリ出力 from Prototype02（Release Any CPU）」を選択しOKボタンをクリックする
10. 作成されたShortcutのプロパティでNameを「CTCHAIN-Prototype02」に変更する
11. File System on Target Machine＞User's Desktopのプロパティ「AlwaysCreate」を「True」に設定する
12. File System on Target Machine＞User's Programs Menuを選択、右ペインで右リック＞新しいショートカットの作成を選択
13. Select Item in Projectダイアログで「Look inでApplication Folder」を選択「プライマリ出力 from Prototype02（Release Any CPU）」を選択しOKボタンをクリッする
14. 作成されたShortcutのプロパティでNameを「CTCHAIN-Prototype02」に変更する
15. ツールバーの「ソリューション構成」で「Release」「Any CPU」になっている状態プロジェクト「CTCHAIN-Prototype02」のリビルドを実施
16. 出力結果ですべてのリビルドが正常終了していることを確認
17. プロジェクト「CT_Chain-Prototype02」を右クリックし「エクスプローラーでフォダを開く
18. Releaseフォルダ配下にインストーラー「CTCHAIN-Prototype02.msi」が生成される

## 実行モジュール

### ＜実行モジュール動作環境前提条件＞

    OSバージョン            ：Microsoft Windows10
    .NETFrameworkバージョン ：4.8
    KeychainCOREバージョン  ：2.4.2

### ＜実行モジュールインストール手順＞

1. CTCHAIN-Prototype02.msi実行を実行し、アプリケーションをインストールする\
   ※インストールフォルダの選択時に「このユーザーのみ」を選択すること
2. CTCHAIN-Prototype02のApp.Confingの変更
    1. アプリケーションをインストールしたフォルダのApp.configについて以下を設定する
    - App.configファイル
      - C:\Program Files (x86)\CMIC HOLDINGS Co., Ltd\CT-Chain-Prototype02\Prototype02.exe.config

    2. 管理アプリケーションに接続するため以下のKeyに対してValueを設定する
    - crodirectoryServiseURL				：Valueに管理者アプリケーションサービスURLを設定
      - 例）https://example-site/crodirectory/ ※ドメイン部分は要変更
        - crodirectoryAuditLogServiseURL：Valueに管理者アプリケーション監査証跡出力サービスURLを設定
      - 例）https://example-site/croaudit/	※ドメイン部分は要変更
        - crodirectoryDevicestorageServiseURL：Valueに管理者アプリケーションデバイスストレージ出力サービスURLを設定
      - 例）https://example-site/devicestorage/	※ドメイン部分は要変更

    3. クラウドストレージ（Box）に接続するための情報を以下のKeyに対してValueを設定する

           boxClientId       ：ValueにBOX APIのクライアントIDを設定
           boxClientSecretId ：ValueにBOX APIのクライアントシークレットを設定
           boxUserId         ：ValueにBOX APIのユーザーIDを設定

    ＜前提条件＞
    暗号化されたファイルのやり取りに使用するクラウドストレージとしてBoxを利用しておりアクセスするためには別途契約が必要となります。利用・契約に関しては下のサイトをごください。\
    https://www.box.com/ja-jp/home
						
3. KeychainCOREモジュールの配置
KeychainCOREモジュールを含むCMIC-Keycgaub.zipは契約上機密事項のため公式ファイルには含まれておりません。\
手順についても記載を省略いたします。
