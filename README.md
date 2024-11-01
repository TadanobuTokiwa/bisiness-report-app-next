# 業務報告アプリ

このリポジトリは、「業務報告アプリ」というアプリケーションのソースコードを管理しています。ロジ内での使用を目的として作成しています。　　

## 概要

「業務報告アプリ」は、1日の業務内容を投稿し、自他ユーザーがリストで確認、CSV出力などの外部出力を目的としています。　　

### 機能一覧

- 業務報告: 1日行った業務を各業務項目ごとに  
    1,業務内容 2,開始時間 3,終了時間 4,件数  
    を記載し投稿します

- リスト機能: 日付、従業員名、タスク項目名で検索を行い、業務内容を確認できます  
    ※ 一部タスクは編集も可能です  
    ※ 件数 / 1h といった簡単な計算を表示しています  
    ※ 抽出したリストはCSV出力することが可能です  　　

- 管理者用画面: 業務項目の管理、全ユーザーのリスト、他ユーザーの報告を行える画面です　　　　

## 使用技術

| 項目  | 言語・フレームワーク |
| ------------- | -------------- |
| Language      | TypeScript                    |   
| Front-end     | Next.js (App Router)          |  
| Global State  | Redux (Redux Toolkit)         |  
| Server State  | React Query                   |  
| Back-end      | Firebase (Firestore Database) |  
| Authentication| Firebase (Authentication)     |  
| Style         | shadcn/ui , Tailwind CSS      |  
| Hosting       | Vercel                        |   

## インストール方法

1. リポジトリをクローンします:  
   ```bash  
   git clone https://github.com/Tadanobu Tokiwa/bisiness-report-app-next.git   
2. 必要な依存関係をインストールします:  
   ```bash  
   npm install    
3. ローカル環境でサーバーを起動します:  
   ```bash  
   npm run dev  
## 環境変数の設定

このアプリケーションには、APIキーやその他の機密情報を管理するために環境変数が必要です。環境変数は .env.local ファイルに設定します。設定が必要な変数は以下の通りです。  

.env  
NEXT_PUBLIC_FIREBASE_API_KEY  
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  
NEXT_PUBLIC_FIREBASE_PROJECT_ID  
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  
NEXT_PUBLIC_FIREBASE_APP_ID  

全てFirebaseの機能と連携するためのKeyです　　

## アプリ操作方法  

- ログイン  
Googleアカウントでログインを行います  
※ メールアドレス末尾が"@rext.work"以外はFirebase上では一度ログインしますがクライアント側で弾きます  
ログインキーの入力  
※ ログインキーの入力内容で一般ユーザー、管理者ユーザー分けています  

- 業務報告  
1日の業務内容を入力し、送信ボタンで投稿してください  
※ 管理者ユーザーは左下に投稿者名をつけることができます  

- リスト  
抽出したい条件を入力、検索し、リストを表示してください  
CSV抽出ボタンで検索したリストの全アイテムをCSVダウンロードします  
※ 管理者ユーザーは全ユーザーが検索対象です  

- 業務項目管理  
業務報告、リストでSelectタグ内のアイテムを作成することができます  

## 状態管理について  
基本的にはComponent内でState管理を行っていますが下記は別方法で管理しています  

- 業務報告カード内(Redux)  
送信前にリスト画面へ遷移を行った際に入力が保持されるようにするため  

- 業務項目(React Query)  
様々な画面で使用するリストで、複数回の読み込みを避けるため　　