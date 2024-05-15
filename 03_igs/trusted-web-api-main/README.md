# trusted-web

## プロジェクト概要

本プロジェクトでは、国際間の教育市場および労働市場が抱える課題を効果的に解決していく。今回の開発対象となるアプリケーションは3つのアプリケーションで構成される。
3つのアプリケーションとは「採用エントリーシステム」「プロセッシングシステム」「採用マッチングシステム」のことを指し、今回の開発対象となるスコープとなる。この3つのシステムが連携することで安全な形で国際間のマッチングを実現することが可能となる。


## 成果物（ソースコード）のリポジトリ概要

フロントエンド・バックエンドの合計2つのリポジトリで構成している。

* trusted-web-matching-ui（フロントエンドリポジトリ）
  * 1: マッチングシステムのWeb UIの実装
 
* trusted-web-api（バックエンドリポジトリ）

  * 1: エントリーシステムのロジック実装
  * 2: プロセッシングシステムのロジック実装
  * 3: マッチングシステムのWebAPI実装

## 登場主体とそれぞれのソフトウェア環境

### 登場主体1: 企業担当者

実証期間の開発スコープにおける主要ステークホルダーは「企業担当者」である。「企業担当者」とは、海外のデジタル人材を採用したいと考えている、日本の大手企業担当者を指す。企業担当者は、Webアプリを使用して候補者とマッチングを行う。企業担当者は候補者にオファーを送信し、マッチング成立後、候補者とアプリ内でコミュニケーションを取ることができる。彼らは採用プロセスを効率的に管理し、候補者との連絡を取るためにアプリを活用する。

### 登場主体2: 企業担当者

「候補者」とは、ONGAESHIを通じてデジタル人材育成のための講座を受講していて、かつ日本企業に就職を検討しているベトナムの学生・若手社会人を指す。候補者はネイティブアプリを利用し、採用マッチングシステムを利用する。候補者はONGAESHIアプリをスマートフォンにインストールし、マッチングのタブを選択してエントリーを行うことが可能。その後、企業担当者からのオファーを受け取り、オファーを承諾するかしないか、選択が可能である。マッチングが成功（=オファーを承諾）した場合、アプリ内で企業担当者と、テキストメッセージを通じてコミュニケーションをとることができる。<br><br>
※ 今回の実証のスコープおいて、ネイティブアプリは設計のみとし、開発に関してはスコープ外である。

## 稼働させるための前提条件

### ESを実行するために前準備が必要（最初に一度だけ実行）

1. ローカル環境でコンテナを起動後、起動中のコンテナに入る。
```
$ docker-compose exec api-matching bash
```

2. 重みベクトルのレコード作成
```
go run cmd/matching/generate_weights/main.go
```

vector_weights テーブルにレコードが生成される。 複数回実行するとその度に新規生成される。 最後に作られたレコードがアプリ内で参照されるようになってます。

3.システムで一意の鍵を作成
```
go run cmd/matching/generate_keys/main.go
```
encrypt_keys テーブルにレコードが生成される。 複数回実行するとその度に新規生成される。 最後に作られたレコードがアプリ内で参照されるようになってます。
  
## ソフトウェア実行手順


1. 候補者の情報がInputされたCSVファイルを用意（以下入力 csv のサンプル）
```
ID,Level,Age,Email,Gender,Country,City,desired salary,self-introduction,IsShowKnowledge,IsShowResponsibility,IsShowCognitive/Individual,IsShowPeer/Community,IsShowBehavior from Learning Attitude,Fintech Knowledge,Descriptive Statistics,Inferential statistics,Econometrics for Finance,Time Series Analysis,Panel Data Analysis,Building Prediction Model,Designing Robo Advisor,Presentation,Responsibility,Problem-setting,Solution-oriented,Creativity,Inquisitiveness,Individual execution ability,Vision,Interests,Resilience,Emotional Control,Decisiveness,Self-expression,Empathy and listening skills,Flexibility,Open-minded,Exercise of Influence,Passion-Evangelize,Sense of ethics,study attitude,attendance
1,1,21,aaa@email.jp,Male,Japan,Tokyo,500,Hello,TRUE,TRUE,TRUE,TRUE,TRUE,0.268,0.268,0.5,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268,0.268
2,2,21,bbb@email.jp,Male,Japan,Tokyo,500,Hello,FALSE,FALSE,FALSE,FALSE,FALSE,0.532,0.532,0.532,0.532,0.532,0.532,0.532,1,1,1,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532,0.532
3,3,21,ccc@email.jp,Famale,Japan,Tokyo,500,Hello,TRUE,TRUE,FALSE,FALSE,FALSE,0.111,0.5,0.1,1,1,1,1,1,1,1,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111,0.111
4,4,21,ddd@email.jp,Famale,Japan,Nagoya,500,Hello,FALSE,FALSE,FALSE,TRUE,TRUE,1,0,1,0.1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
```

2. 環境別に以下のコマンドを実行。

実行コマンド（本番環境）
```
go run cmd/entry/send_candidates/main.go \
    -inputfile "cmd/entry/ES入力ファイルサンプル.csv" \
    -matchingEndpoint "https://tw.ongaeshi-pj.jp/api/matching" \
    -processingEndpoint "https://tw.ongaeshi-pj.jp/api/processing" \
    planY
```
実行コマンド（開発環境）
```
go run cmd/entry/send_candidates/main.go \
    -inputfile "cmd/entry/ES入力ファイルサンプル.csv" \
    -matchingEndpoint "https://dev.tw.ongaeshi-pj.jp/api/matching" \
    -processingEndpoint "https://dev.tw.ongaeshi-pj.jp/api/processing" \
    planY
```

### エントリシステム実行についての注意点

* ユーザ登録するのに約1分程度かかる
* 候補者レコードの枠だけ先に作成されるため、登録実行中は空のユーザが ui の一覧に表示される
* 「登録中ステータス」のようなものは用意していないので、ui 側で弾く場合は email が空かどうか？あたりで判断してください
* 実行後に正常に取り込めているかの確認はcandidatesテーブルをご確認ください
* 複数回実行するとそのまま複数回分登録されるので注意
* 取り込みを開始すると画面の方に空白データが見えてしまいますが、徐々にデータが反映されます。
