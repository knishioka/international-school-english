# Grade 1 English Learning App

インターナショナルスクール1年生向けの英語学習アプリケーション

## 概要

このアプリケーションは、6-7歳の子どもたちが楽しく英語を学べるよう設計されています。日本語と英語のバイリンガル対応で、視覚・聴覚・触覚を活用したマルチセンサリー学習アプローチを採用しています。

## 主な機能

- 🔤 **アルファベット学習**: フォニックスと文字認識
- 📚 **語彙学習**: 日常生活で使う基本単語
- 📖 **ストーリー**: 簡単な英語の物語
- 🎮 **インタラクティブゲーム**: ドラッグ&ドロップ、音声認識
- 📊 **進捗管理**: 学習の記録と成果の可視化
- 🌐 **オフライン対応**: インターネットなしでも学習可能

## 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **状態管理**: Zustand
- **テスト**: Jest + React Testing Library + Playwright
- **品質管理**: ESLint + Prettier + Husky

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone [repository-url]
cd grade-1-english

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 利用可能なスクリプト

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run test         # すべてのテスト実行
npm run test:unit    # ユニットテストのみ
npm run test:e2e     # E2Eテスト
npm run lint         # Lintチェック
npm run typecheck    # 型チェック
```

## プロジェクト構造

```
src/
├── components/      # 再利用可能なコンポーネント
├── contexts/        # React Context (言語、音声)
├── pages/           # ページコンポーネント
├── services/        # ビジネスロジック
├── stores/          # 状態管理
├── styles/          # グローバルスタイル
├── types/           # TypeScript型定義
└── utils/           # ユーティリティ関数
```

## 貢献方法

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ライセンス

MIT License