# signature

このプロジェクトはDockerで構築されています。まず最初に、https://docs.docker.jp/desktop/index.html を参考にして、Docker Desktopをインストール&起動してください。

次に下記のコマンドで、Dockerの環境に入ります。

```bash
cd tw-kyb/icp/signature/
docker compose build
docker compose up -d
docker compose exec app bash -l
```

次に下記のコマンドで、dfxがインストールされていることを確認します。

```bash
dfx --version
dfx 0.18.0
```

## 開発者アカウントの作成

開発者アカウントを作成するために、下記のコマンドを実行します。パスフレーズの入力が求められるので、推測されにくい値を入力し、忘れないように、何らかの手段で保存してください。重要なdfxコマンドを実行するときには、ここで入力したパスフレーズが必要になります。

```bash
dfx identity new dev
Please enter a passphrase for your identity:
```

devアカウントがdfxコマンドのデフォルトのアカウントになるように、次のコマンドを実行します。

```bash
dfx identity use dev
Using identity: "dev".
```

devアカウントは、Docker環境がなくなると消えてしまうので、アカウントのバックアップをとります。実際には、アカウントの秘密鍵をPEMファイルとしてエクスポートします。次のコマンドを実行してください。

```bash
dfx identity export dev > dev.pem
```

dev.pemは、何らかの手段で保存し、dev.pemは消しておきます。

```bash
rm dev.pem
```

## 開発アカウントにICPトークンを振り込む

Internet Computer(以降IC)にCanister(ICのスマートコントラクト)をdeployするためには、開発アカウントにICPトークンを振り込む必要があります。次のコマンドで、アカウントIDを取得します。

```bash
dfx ledger account-id
```

表示されたアカウントIDに、ICPトークンを振り込みます。いろいろな方法があり、その方法も変化することがあるので、ここでは解説しません。

ICPトークンを振り込んだら、次のコマンドでICPトークンの残高を確認します。

```bash
dfx ledger --network ic balance
```

## Cycles Wallet

IC上にCanisterをdeployするためには、Cycles Walletと呼ばれるCanisterが必要です。
Cycles Walletは、次のコマンドで作成します。
--amountでCycles Walletに渡すICPトークンの量を指定します。
開発者アカウントにあるICPトークンの量を超えないように注意してください。
少なすぎるとCanisterのdeployに失敗することがあります。
5 ICPあれば十分です。

```bash
WALLET=$(dfx ledger --network ic create-canister $(dfx identity get-principal) --amount 5)
dfx identity --network ic deploy-wallet $WALLET
dfx identity --network ic set-wallet $WALLET
echo $WALLET
xxxxx-xxxxx-xxxxx-xxxxx-cai
```

Cycles WalletのPrinciple ID(xxxxx-xxxxx-xxxxx-xxxxx-cai)は、後で必要になる場合があるかもしれないので、何らかの手段で保存しておきましょう。

Cycles Walletの残高を確認します。Cycles Walletでは、残高はcyclesに変換されて管理されています。

```bash
dfx wallet --network ic balance
```

## canister_ids.jsonの削除

canister_ids.jsonは、CanisterのIDが記録されています。最初にICにdeployするときに作成され、以後、同じIDでCanisterがdeployされるようになります。今回は、あなた自身のCanisterをdeployしたいので、削除しておきます。

```bash
rm canister_ids.json
```

## デプロイ

IC上にCanisterをdeployするには次のコマンドを実行します。

```bash
dfx deploy --network ic signature_backend
```
