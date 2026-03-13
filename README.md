# 🪑 座席配置変更アプリ (Change Seats App)

教職員が直感的に教室の座席配置を作成、管理するためのWebアプリケーションです。クリックによる簡易な入れ替えから、ワンクリックでのランダム配置まで、面倒な座席の運用を大幅に効率化します。

## ✨ 主な機能

- **座席の管理・編集**: 実際の教室を模したグリッドUIで座席を配置
- **ランダムシャッフル機能**: ワンクリックで生徒の座席をランダムに再配置
- **クリックによる座席の移動**: 任意の座席をクリックすることで入れ替え
- **生徒管理**: アプリ内で生徒情報を一元管理（登録・編集・削除）
- **データ連携**: `xlsx` (SheetJS) を用いた名簿データのシームレスな入出力機能に対応
- **印刷サポート**: 完成した座席表を美しいレイアウトのままプリンタで印刷・PDF出力
- **セキュアな認証**: ユーザー本登録、一時登録時の情報更新などをルートベースで堅牢に制御 (Supabase Auth)
- **モダンで直感的なUI**: Lucide ReactアイコンとTailwind CSSによる美しくレスポンシブなデザイン

## 🛠 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| **Frontend Framework** | [React 19](https://react.dev/) / [Vite 7](https://vitejs.dev/) |
| **Routing** | [React Router 7](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **State Management** | [Jotai](https://jotai.org/) |
| **Backend / Database** | [Supabase](https://supabase.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Utility (Print)** | [react-to-print](https://github.com/gregnb/react-to-print) |
| **Utility (Excel)** | [xlsx (SheetJS)](https://sheetjs.com/) |

## 🚀 環境構築と起動

リポジトリを適当なディレクトリにクローン後、以下の手順でローカル環境を構築してください。

### 1. 依存パッケージのインストール

Node.js環境 (推奨 18.x以上) が整っていることを確認し、依存パッケージをインストールします。

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、ご自身の Supabase プロジェクトの資格情報を設定してください。これらの値は Supabase ダッシュボードの「Project Settings > API」から取得できます。

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ターミナルに表示されたローカルURL（通常は `http://localhost:5173` ）にブラウザでアクセスすると、アプリケーションが起動します。

## 📁 ディレクトリ構成の概要

アプリケーションにおける関心の分離（Separation of Concerns）を明確にするため、以下のフロントエンド構造を採用しています。

```text
src/
├── components/          # 再利用可能な共通UIコンポーネント
├── modules/             # ドメインロジックごとの機能分割 (auth, layouts, students 等)
├── page/                # ページ単位のルーティング用コンポーネント (Home, Signin 等)
├── Routes/              # アクセス権限に基づくルーティングおよび保護機能 (Auth Guards)
├── contexts/            # React Context (アプリ全体の状態等)
├── lib/                 # Supabase クライアント等の初期化・外部ライブラリ設定
├── utils/               # アプリケーション共通のユーティリティ関数
├── type.ts              # アプリケーション全体の型定義
└── main.tsx / App.tsx   # Reactのエントリーポイントとルーター設定
```

## 🔒 認証とルーティング

ユーザーの登録状態に応じたきめ細かいアクセス制御が実装されています。これにより、安全なデータ管理を実現しています。

- **保護されたルート (`ProtectedRoute`)**: 本登録が完了したユーザーのみがアクセス可能なメインの座席管理機能です (`/`)。
- **仮ユーザー用ルート (`AnonymousOnlyRoute`)**: サインインは完了しているが追加情報の更新が必要な仮登録ユーザー用のページです (`/updateUser`)。
- **パブリックルート (`PublicOnlyRoute`)**: 未ログインのユーザーがアクセスするための認証・登録関連ページです (`/signin`, `/registered`)。

## 📄 ライセンス

MIT License

## 🤝 サポート

バグの報告や機能のご要望は、GitHubのIssuesからお知らせください。
