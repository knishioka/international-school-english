# プロジェクトドキュメント一覧

このディレクトリには、International School English Learning Appの開発・運用に必要なドキュメントが含まれています。

## 📚 ドキュメント構成

### 🏗️ 開発ドキュメント

#### [ARCHITECTURE.md](./ARCHITECTURE.md)
- **目的**: システムアーキテクチャの設計と実装パターンの説明
- **対象**: 新機能開発を行う開発者
- **内容**: 
  - プロジェクト構造の詳細
  - 設計原則とベストプラクティス
  - 実装パターンのサンプル

#### [MAINTENANCE.md](./MAINTENANCE.md)
- **目的**: 日常的なメンテナンス作業のガイド
- **対象**: プロジェクトメンテナー、コンテンツ更新者
- **内容**:
  - コンテンツ（単語、文章、ストーリー）の追加方法
  - 定期的なメンテナンスチェックリスト
  - トラブルシューティング手順

### 📖 機能別ドキュメント

#### [KANJI_IMPLEMENTATION_GUIDE.md](./KANJI_IMPLEMENTATION_GUIDE.md)
- **目的**: 漢字レベル機能の実装ガイド
- **対象**: 漢字表示機能を扱う開発者
- **内容**:
  - 漢字レベルシステムの仕組み
  - KanjiGrade型の使用方法
  - 実装例とベストプラクティス

#### [KANJI_REFERENCE.md](./KANJI_REFERENCE.md)
- **目的**: 学年別漢字のリファレンス
- **対象**: コンテンツ作成者、開発者
- **内容**:
  - 小学1-6年生の学習漢字一覧
  - 使用上の注意事項

### 🔧 技術ドキュメント

#### [test-strategy.md](./test-strategy.md)
- **目的**: テスト戦略と実装ガイド
- **対象**: テストコードを書く開発者
- **内容**:
  - ユニットテストの書き方
  - E2Eテストの実装方法
  - テストのベストプラクティス

#### [PORT_MANAGEMENT.md](./PORT_MANAGEMENT.md)
- **目的**: 開発環境のポート管理
- **対象**: ローカル開発環境をセットアップする開発者
- **内容**:
  - ポート設定方法
  - ポート競合の解決方法
  - 環境変数の使用方法

## 🚀 クイックスタート

### 新しい開発者の方へ
1. まず[CLAUDE.md](../CLAUDE.md)を読んで全体像を把握
2. [ARCHITECTURE.md](./ARCHITECTURE.md)でシステム設計を理解
3. [test-strategy.md](./test-strategy.md)でテストの書き方を学習

### コンテンツを更新したい方へ
1. [MAINTENANCE.md](./MAINTENANCE.md)の「コンテンツの更新」セクションを参照
2. 更新後は必ずテストを実行

### トラブルが発生した場合
1. [MAINTENANCE.md](./MAINTENANCE.md)の「トラブルシューティング」を確認
2. [PORT_MANAGEMENT.md](./PORT_MANAGEMENT.md)でポート関連の問題を解決

## 📝 ドキュメント更新ルール

- ドキュメントは常に最新の状態を保つ
- 実装に変更があった場合は、関連するドキュメントも更新
- 日本語と英語の両方で重要な情報は記載
- Markdownフォーマットを統一して使用

## 🔗 外部リンク

- [プロジェクトREADME](../README.md)
- [貢献ガイドライン](../CONTRIBUTING.md)
- [ライブデモ](https://knishioka.github.io/international-school-english/)