# 座席配置変更アプリ (Change Seats App)

教室の座席配置を簡単に管理・変更できるWebアプリケーションです。生徒の座席をランダムに配置したり、手動で入れ替えたりできます。

## 主な機能

- **座席配置管理**: 教室の座席をグリッド形式で表示・管理
- **ランダム配置**: 生徒の座席をランダムに配置
- **座席交換**: ドラッグ&ドロップで座席を交換
- **生徒管理**: 生徒情報の登録・編集・削除
- **履歴管理**: 過去の座席配置を記録
- **印刷機能**: 座席配置を印刷
- **ユーザー認証**: メール/パスワード認証
- **設定画面**: アプリケーション設定

## 技術スタック

| 技術           | バージョン |
| -------------- | ---------- |
| React          | 19.2.0     |
| TypeScript     | 5.9.3      |
| Vite           | 7.2.4      |
| React Router   | 7.12.0     |
| Tailwind CSS   | 4.1.18     |
| Supabase       | 2.93.3     |
| Jotai          | 2.17.0     |
| React to Print | 3.2.0      |

## インストール

### 前提条件

- Node.js 18以上
- npm または yarn

### セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>

# ディレクトリに移動
cd change-seats-app

# 依存関係をインストール
npm install
```

### 環境変数の設定

`.env.local` ファイルを作成して、Supabaseの認証情報を設定してください：

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 実行

### 開発モード

```bash
npm run dev
```

アプリはブラウザで `http://localhost:5173` (Viteのデフォルトポート) で起動します。

### ビルド

```bash
npm run build
```

本番環境用にアプリをビルドします。

### プレビュー

```bash
npm run preview
```

ビルド後のアプリをローカルプレビューします。

### リント

```bash
npm run lint
```

コードの品質をチェックします。

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── home/           # ホーム画面のコンポーネント
│   ├── layout/         # レイアウトコンポーネント
│   └── ui/             # UI部品
├── contexts/           # React Context
├── lib/                # ライブラリ設定（Supabase等）
├── modules/            # ビジネスロジック
│   ├── auth/           # 認証関連
│   ├── layouts/        # 座席配置関連
│   ├── students/       # 生徒管理
│   └── viewMode/       # ビューモード
├── page/               # ページコンポーネント
├── Routes/             # ルート定義
├── utils/              # ユーティリティ関数
├── App.tsx             # メインアプリケーション
├── main.tsx            # エントリーポイント
└── type.ts             # 型定義
```

## 使い方

### ユーザー登録・ログイン

1. `/signup` ページでメールアドレスとパスワードで登録
2. 登録後、確認ページで完了を待つ
3. `/signin` ページでログイン

### 座席配置

1. ホーム画面で教室の座席を確認
2. 「ランダム配置」ボタンで自動配置、または手動で座席を交換
3. 座席の印刷が可能
4. 変更内容は自動的に保存されます

### 生徒管理

1. 「生徒管理」メニューから生徒情報を管理
2. 生徒の追加・編集・削除が可能

## スクリーンショット

（スクリーンショットを追加予定）

## ライセンス

MIT

## サポート

問題が発生した場合は、GitHubのIssuesよりご報告ください。

## 開発者向け情報

### ESLint設定のカスタマイズ

プロダクション環境では、ESLintの設定を強化することをお勧めします。`eslint.config.js` を編集して、型チェック対応のルールを有効にしてください。

### React Compilerの有効化

必要に応じてReact Compilerを有効化できます。詳細は [React公式ドキュメント](https://react.dev/learn/react-compiler/installation) をご参照ください。
