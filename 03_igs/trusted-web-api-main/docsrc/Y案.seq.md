# 個人主権重視型のアーキテクチャ

## システム間連携に必要なAPI

名前は便宜上つけてます。連番ですが順不同。
登場箇所は下記のシーケンス図を参照。

#### API-MS01

* MS 上で稼働
* ESから呼び出される
* ユーザの公開鍵を受け取る
* user_id を発行する
* user_id + システムの公開鍵を返却する

#### API-MS02

* MS 上で稼働
* PS から呼び出される
* 重み付けデータを暗号化して返却する

#### API-MS03

* MS 上で稼働
* PSから呼び出される
* 暗号化済み秘密計算、暗号化済み個人情報を受け取る
* 上記を復号化の後、保存する


#### API-PS01

* PS 上で稼働
* ES から呼び出される
* 暗号化されたベクトル、ユーザの秘密鍵から生成された再線形化キー、ガロアキーを受け取る
* 秘密鍵計算を実行する
* 計算結果をMSに送信する


## シーケンス図

ユーザの手元で作成される 【秘密鍵, 公開鍵】を【sk_ES, pk_ES】 と記載する
システムで一意の 【秘密鍵, 公開鍵】を【sk_MS, pk_MS】 と記載する

### fig.1 システムの鍵作成

```mermaid
sequenceDiagram
    autonumber
    actor CANDIDATE as 候補者
    participant ES as 採用エントリーシステム（ES）
    participant PS as プロセッシングシステム（PS）
    participant MS as 採用マッチングシステム（MS）
    participant DB as Storage

    MS ->> MS: 鍵作成（sk_MS, pk_MS）
    MS ->> DB: sk_MS 保存
    MS ->> DB: pk_MS 保存
```


### fig2. データ入力から秘密計算結果保存までの流れ


```mermaid
sequenceDiagram
    autonumber
    actor CANDIDATE as 候補者
    participant ES as 採用エントリーシステム（ES）
    participant PS as プロセッシングシステム（PS）
    participant MS as 採用マッチングシステム（MS）
    participant DB as Storage

    ES ->> ES: docker container<br>起動
    Activate ES

    CANDIDATE ->> ES: 個人情報+ベクトル値（excel）<br>アップロード
    ES ->> ES: 入力 excel のパース

    loop ユーザごとに繰り返し
        ES ->> ES: 鍵生成（sk_ES, pk_ES）
        ES ->> ES: 秘密計算用鍵生成（relinkey, galoiskey）

        ES ->> MS: pk_ES<br>送信
        Note over ES,MS: API-MS01
        MS ->> MS: user_id 発行
        MS ->> DB: user_id + pk_ES 保存
        DB -->> MS: OK
        MS -->> ES: user_id + pk_MS 返却

        ES ->> ES: ベクトル値<br>暗号化（pk_ES）

        ES ->> PS: user_id<br> + 暗号化済みベクトルデータ<br>+ relinkey<br>+ galoiskey<br>送信
        Note over ES,PS: API-PS01

        PS ->> MS: 重み付けデータ取得<br>user_id 送信
        Note over PS,MS: API-MS02

        MS ->> DB: pk_ES 取得
        DB -->> MS: 返却

        MS ->> DB: 重み付けデータ取得
        DB -->> MS: 返却

        MS ->> MS: 重み付けデータ<br>暗号化（pk_ES）
        MS -->> PS: 返却

        PS ->> PS: 秘密計算<br>〈暗号化済みベクトルデータ, 暗号化済み重み付けデータ〉<br>+ relinkey + galoiskey

        PS -->> ES: 秘密計算結果<br>返却
        ES ->> ES: 復号化（sk_ES）

        ES -->> CANDIDATE: 送信確認
        Note over ES,CANDIDATE: 候補者に送信確認があるべきだが、<br>検証段階ではスキップする

        ES ->> ES: 秘密計算結果<br>暗号化（pk_MS）
        ES ->> ES: 個人情報データ<br>暗号化（pk_MS）

        ES ->> MS: user_id + 秘密計算結果 + 暗号化済み個人情報データ<br>送信
        Note over ES,MS: API-MS03

        MS ->> MS: 秘密計算結果<br>復号化（sk_MS）
        MS ->> DB: 保存
        DB -->> MS: OK
        
        MS ->> MS: 暗号化済み個人情報データ<br>復号化（sk_MS）
        MS ->> DB: 保存
        DB -->> MS: OK

        MS -->> ES: OK
    end

    ES -->> CANDIDATE: OK
    Deactivate ES
```

