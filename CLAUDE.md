# CLAUDE.md - AI開発アシスタントガイドライン

このドキュメントはAIアシスタント（Claude等）がこのプロジェクトで作業する際の重要な情報とガイドラインをまとめたものです。

> **クイックリファレンス**: よく使うコマンドや手順は[CLAUDE_QUICK_REFERENCE.md](docs/CLAUDE_QUICK_REFERENCE.md)を参照してください。

## プロジェクト概要

- **プロジェクト名**: International School English Learning App
- **対象**: インターナショナルスクールに通う日本人の子供（小学生）
- **目的**: 日英バイリンガル対応の実用的な英語学習アプリケーション
- **技術的制約**: フロントエンドのみ、サーバーレス、オフライン対応

## 開発環境

### 必須コマンド
```bash
# 開発サーバー起動
npm run dev
npm run dev:auto-port  # 自動的に空きポートを検出

# ビルド
npm run build
npm run build:test  # E2Eテスト用ビルド

# テスト実行
npm run test  # 全テスト（unit + E2E）
npm run test:unit  # ユニットテストのみ
npm run test:e2e  # E2Eテスト（本番ビルド、ポート4173）
npm run test:e2e:dev  # E2Eテスト（開発サーバー、デバッグ用）

# コード品質チェック（コミット前に必ず実行）
npm run lint
npm run typecheck
npm run test:unit

# プッシュ前の確認（必須）
# 以下のコマンドをすべて実行し、エラーがないことを確認してからpushすること
npm run lint && npm run typecheck && npm run test:unit && npm run test:e2e
```

### ポート管理
開発環境でのポート競合を避けるため、以下の設定が可能：

- **開発サーバー**: デフォルト3000番（`VITE_PORT`で変更可能）
- **E2Eテストサーバー**: デフォルト4173番（`VITE_TEST_PORT`で変更可能）

```bash
# カスタムポートで開発
VITE_PORT=5173 npm run dev

# カスタムポートでE2Eテスト
VITE_TEST_PORT=5000 npm run test:e2e
```

**重要**: E2Eテストは開発サーバーとは独立した本番ビルドを使用します。これにより：
- 開発中の作業に影響を与えない
- 本番環境に近い状態でテスト
- ポート競合を回避

詳細は`docs/PORT_MANAGEMENT.md`を参照。

### プロジェクト構造
```
/src
  /components    # 再利用可能なUIコンポーネント
  /contexts     # React Context（グローバル状態管理）
  /data         # 静的データファイル（語彙、文章、ストーリー等）
  /hooks        # カスタムフック
  /pages        # ページコンポーネント
  /services     # ビジネスロジック
  /types        # TypeScript型定義
  /utils        # ユーティリティ関数
  /styles       # グローバルスタイル
/tests
  /unit         # ユニットテスト
  /e2e          # Playwrightテスト
/docs           # プロジェクトドキュメント
```

**詳細**: `docs/ARCHITECTURE.md`を参照

## コーディング規約

### TypeScript
- **strict mode**: 必須
- **型定義**: anyの使用禁止
- **命名規則**: 
  - コンポーネント: PascalCase
  - 関数・変数: camelCase
  - 定数: UPPER_SNAKE_CASE

### React
- **関数コンポーネント**: クラスコンポーネント禁止
- **カスタムフック**: use接頭辞必須
- **メモ化**: 必要に応じてuseMemo, useCallback使用

### スタイリング
- **Tailwind CSS**: 優先使用
- **CSS Modules**: 複雑なスタイルの場合
- **インラインスタイル**: 避ける

## 開発フロー

### 機能開発時の手順
1. **実装**: 機能を実装
2. **ユニットテスト**: 主要な機能にテストを追加（過度に細かいテストは不要）
3. **品質チェック**: `npm run lint && npm run typecheck && npm run test:unit`
4. **自動プッシュ**: 全てのチェックが通ったら自動的にpush

### 自動化ルール
- lintとtestが通っていれば、機能開発完了時に自動的にpushする
- コミットメッセージは実装内容を明確に記載
- pre-commitフックで品質を保証

### プッシュとデプロイのステータス報告

**AIアシスタントは以下のルールに従って作業状況を報告すること：**

1. **プッシュ状態の報告**:
   - `git push`を実行したら「✅ push済み」と報告
   - pushしていない場合は何も言わない（「pushしていません」とは言わない）

2. **デプロイ状態の確認と報告**:
   - pushした後、以下のコマンドでGitHub Actionsのステータスを確認:
     ```bash
     gh run list --limit 5
     # または
     gh run view
     ```
   - デプロイが成功したら「✅ deploy済み」と報告
   - デプロイ中の場合は「🔄 deploying...」と報告
   - デプロイに失敗した場合は「❌ deploy failed」と報告

3. **報告の例**:
   ```
   ✅ push済み
   🔄 deploying...
   （数分後に確認）
   ✅ deploy済み
   ```

## テスト戦略

### ユニットテスト
- **カバレッジ目標**: 80%以上
- **テスト対象**: 
  - ユーティリティ関数
  - カスタムフック
  - 重要なビジネスロジック
  - 新機能の主要な動作
- **テストの粒度**: 
  - 主要な正常系・異常系をカバー
  - 細かすぎるテストは避ける
  - 保守性を重視

### E2Eテスト（Playwright）
- **対象シナリオ**:
  - ユーザーの主要な学習フロー
  - ゲームの完全なプレイスルー
  - 進捗保存と復元
- **ヘッドレステスト**: CI/CDで自動実行

### テストファイル命名
- ユニット: `*.test.ts(x)`
- E2E: `*.spec.ts`

## セキュリティとプライバシー

- **個人情報**: 収集しない
- **データ保存**: LocalStorageのみ使用
- **外部API**: 使用しない
- **音声認識**: ブラウザAPIのみ、外部送信なし

## パフォーマンス要件

- **初回ロード**: 3秒以内
- **ページ遷移**: 即座
- **アニメーション**: 60fps維持
- **バンドルサイズ**: 1MB以下（gzip後）

## アクセシビリティ

- **WCAG 2.1 Level AA**: 準拠
- **キーボード操作**: 完全対応
- **スクリーンリーダー**: 基本対応
- **色覚多様性**: 考慮したデザイン

## 子ども向けUI/UX原則

1. **大きなタッチターゲット**: 最小44x44px
2. **明確なフィードバック**: 音と視覚効果
3. **エラー処理**: 優しい言葉で説明
4. **時間制限なし**: プレッシャーを与えない
5. **ポジティブな強化**: 失敗を罰しない

## Git規約

### Pre-commitフック
このプロジェクトではHuskyによるpre-commitフックが設定されています。コミット時に自動的に以下のチェックが実行されます：

- ESLint（自動修正含む）
- Prettier（コードフォーマット）
- TypeScriptの型チェック
- ユニットテスト

**重要**: pre-commitフックを絶対に無視しないでください。エラーが発生した場合は、必ず修正してからコミットしてください。

### コミットメッセージ
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: フォーマット
- refactor: リファクタリング
- test: テスト
- chore: ビルド、補助ツール

### ブランチ戦略
- main: 本番環境
- develop: 開発ブランチ
- feature/*: 機能開発
- fix/*: バグ修正

## デプロイメント

- **ホスティング**: Vercel/Netlify推奨
- **PWA**: 必須（オフライン対応）
- **CDN**: 静的アセットは必ずCDN経由

## 重要な注意事項

1. **日本語対応**: すべてのUIテキストは日英切り替え可能に
2. **音声ファイル**: MP3形式、最適化必須
3. **画像**: WebP形式優先、適切な圧縮
4. **フォント**: 日本語対応フォント必須
5. **ブラウザ対応**: Chrome, Safari, Edge最新版

## トラブルシューティング

- **音声が再生されない**: ユーザージェスチャー必要
- **LocalStorage制限**: 5MB以内に収める
- **PWAインストール**: HTTPSが必須

## 関連ドキュメント

### 必読ドキュメント
- **アーキテクチャ設計**: `docs/ARCHITECTURE.md` - システム設計と実装パターン
- **メンテナンスガイド**: `docs/MAINTENANCE.md` - 日常的なメンテナンス手順
- **漢字実装ガイド**: `docs/KANJI_IMPLEMENTATION_GUIDE.md` - 漢字レベル機能の実装詳細

### リファレンス
- **テスト戦略**: `docs/test-strategy.md` - テストの書き方と実行方法
- **ポート管理**: `docs/PORT_MANAGEMENT.md` - 開発環境のポート設定
- **漢字リファレンス**: `docs/KANJI_REFERENCE.md` - 学年別漢字一覧
- **コントリビューション**: `CONTRIBUTING.md` - 貢献方法

### 重要な作業手順

#### 新機能追加時
1. `docs/ARCHITECTURE.md`で設計パターンを確認
2. 該当するデータファイルを`src/data/`に追加
3. テストを書く（`docs/test-strategy.md`参照）
4. ドキュメントを更新

#### コンテンツ更新時
1. `docs/MAINTENANCE.md`の「コンテンツの更新」セクションを参照
2. 該当するデータファイルを編集
3. テストを実行して確認

#### トラブルシューティング
1. まず`docs/MAINTENANCE.md`の「デバッグ手順」を確認
2. 解決しない場合は`docs/ARCHITECTURE.md`で設計を理解
3. それでも解決しない場合はIssueを作成