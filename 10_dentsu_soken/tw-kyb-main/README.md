# KYC/KYBに基づいたトラストのある取引を促進する新しい仕組み
これは、2023年度Trusted WebのKYC/KYBプロジェクトです。

## プロジェクト概要

[基本設計書](https://github.com/dentsusoken/tw-kyb/blob/main/doc/%E5%9F%BA%E6%9C%AC%E8%A8%AD%E8%A8%88%E6%9B%B8.pdf)

[要件定義書](https://github.com/dentsusoken/tw-kyb/blob/main/doc/%E8%A6%81%E4%BB%B6%E5%AE%9A%E7%BE%A9%E6%9B%B8.pdf)


## 動作環境
以下の環境で動作します。

ミドルウェア

- Node.js 18.x

- React.js 18.2.x

- Next.js v14.1.x

- Expo 49.x

- rustc 1.76.x

- dfx 0.17.x

- Java 1.8.x

- apache-maven 3.8.x

## 環境構築手順

以下の手順で環境構築を行います。
  1. [Visual Studio Codeのインストール](https://code.visualstudio.com/download)及びセットアップ
  2. [Dockerのインストール](https://www.docker.com/products/docker-desktop/)
  3. Gitアカウント作成
  4. Gitのインストール（Windowsのみ）
  5. [ソースコード](https://github.com/dentsusoken/tw-kyb.git)のダウンロード
  6. Node.jsのインストール
  7. Expo goのインストール
  8. Firebaseプロジェクトの作成
  9. Firebase Authenticationの設定
  10. GCPプロジェクトの作成
  11. Google App Engineの設定
  12. java-oauth-serverのデプロイ
  13. walletアプリの起動

詳細については、[環境構築手順書](https://github.com/dentsusoken/tw-kyb/raw/main/doc/%E3%83%87%E3%83%A2%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%E6%89%8B%E9%A0%86.docx?raw=true)を御覧ください。

## 注意事項
本アプリケーションは実証実験用のプロトタイプシステムです。
実運用上での利用は保障されていません。
実運用においては、性能およびセキュリティ等についても別途検討が必要です。
