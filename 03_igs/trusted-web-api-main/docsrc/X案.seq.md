# シンプルなアーキテクチャ

## システム間連携に必要なAPI

名前は便宜上つけてます。連番ですが順不同。
登場箇所は下記のシーケンス図を参照。

#### API-MS01

* MS 上で稼働
* ESから呼び出される
* 公開鍵を返却する

#### API-MS02

* MS 上で稼働
* PS から呼び出される
* 重み付けデータを暗号化して、再線形化キー、ガロアキーと共に返却する

#### API-MS03

* MS 上で稼働
* PSから呼び出される
* 秘密計算結果を受け取って、復号化の後、保存する

#### API-MS04

* MS 上で稼働
* ES から呼び出される
* 暗号化された個人情報を受け取って保存する

#### API-PS01

* PS 上で稼働
* ES から呼び出される
* 暗号化されたベクトルを受け取る
* 秘密鍵計算を実行する
* 計算結果をMSに送信する


## シーケンス図

### fig.1 システムの鍵作成

システムで一意。

```mermaid
sequenceDiagram
    autonumber
    actor CANDIDATE as 候補者
    participant ES as 採用エントリーシステム（ES）
    participant PS as プロセッシングシステム（PS）
    participant MS as 採用マッチングシステム（MS）
    participant DB as Storage

    MS ->> MS: 秘密鍵、公開鍵生成
    MS ->> DB: 公開鍵保存
    MS ->> DB: 秘密鍵保存

    MS ->> MS: 再線形化キー(relinkey)生成
    MS ->> DB: 再線形化キー保存

    MS ->> MS: ガロアキー(galoiskey)生成
    MS ->> DB: ガロアキー保存
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

    ES ->> MS: 公開鍵取得
    Note over ES,MS: API-MS01
    MS -->> ES: 返却

    CANDIDATE ->> ES: 個人情報+ベクトル値（excel）<br>アップロード
    ES ->> ES: 入力 excel のパース

    loop ユーザごとに繰り返し
        par 暗号化済み個人情報送信
            ES ->> ES: 個人情報<br>暗号化

            ES ->> MS: 暗号化済み個人情報 + user_id <br>送信
            Note over ES,MS: API-MS04

            MS ->> DB: 保存
            DB -->> MS: OK
            
            MS -->> ES: OK
        and 暗号化済みベクトルデータ送信
            ES ->> ES: ベクトル値<br>暗号化

            ES ->> PS: 暗号化済みベクトルデータ<br>送信
            Note over ES,PS: API-PS01

            PS ->> MS: 重み付けデータ取得
            Note over PS,MS: API-MS02

            MS ->> DB: 重み付けデータ取得
            DB -->> MS: 返却

            MS ->> MS: 重み付けデータ<br>暗号化
            MS -->> PS: 暗号化済み重み付けデータ<br>+ 再線形化キー<br>+ ガロアキー<br>返却

            PS ->> PS: 秘密計算<br>〈暗号化済みベクトルデータ, 暗号化済み重み付けデータ〉<br>+ relinkey + galoiskey

            PS ->> MS: 秘密計算結果 + user_id<br>送信
            Note over PS,MS: API-MS03

            MS ->> MS: 秘密計算結果復号化

            MS ->> DB: 保存
            DB -->> MS: OK

            MS -->> PS: OK

            PS -->> ES: OK
        end


    end

    ES -->> CANDIDATE: OK
    Deactivate ES
```

