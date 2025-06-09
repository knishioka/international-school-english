# Claude用クイックリファレンス

このドキュメントは、AIアシスタント（Claude）が素早く必要な情報にアクセスできるようにまとめたものです。

## 🚀 よく使うコマンド

```bash
# 開発開始
npm run dev

# コード品質チェック（コミット前に必須）
npm run lint && npm run typecheck && npm run test:unit

# プッシュ前の完全チェック
npm run lint && npm run typecheck && npm run test:unit && npm run test:e2e
```

## 📂 重要なファイルパス

### データファイル（コンテンツ追加・編集）
- `src/data/vocabularyWords.ts` - 単語カードのデータ
- `src/data/sentences.ts` - 文章練習のデータ
- `src/data/spellingWords.ts` - スペリングゲームのデータ
- `src/data/stories.ts` - お話のデータ
- `src/data/categories.ts` - カテゴリー定義

### 型定義
- `src/types/vocabulary.ts` - 共通の型定義

### コンポーネント
- `src/components/` - 再利用可能なUIコンポーネント
- `src/pages/` - ページコンポーネント

## 🔧 よくあるタスク

### 新しい単語を追加
1. `src/data/vocabularyWords.ts`を開く
2. 配列に新しいオブジェクトを追加
```typescript
{
  id: '101',
  english: 'example',
  japanese: 'れい',
  romaji: 'rei',
  category: 'school',
  image: '/images/example.jpg',
  emoji: '📝',
  example: {
    english: 'This is an example.',
    japanese: 'これは れいです。',
  },
}
```

### 新しい文章を追加
1. `src/data/sentences.ts`を開く
2. 漢字レベル別の表記を忘れずに追加

### バグ修正の手順
1. 問題のあるコンポーネントを特定
2. テストを書いて問題を再現
3. 修正を実装
4. テストが通ることを確認
5. `npm run lint && npm run typecheck`を実行

## ⚠️ 注意事項

### やってはいけないこと
- ❌ `any`型の使用
- ❌ `console.log`を残したままコミット
- ❌ テストを書かずに新機能追加
- ❌ pre-commitフックを無視

### 必ずやること
- ✅ TypeScriptの型を明示的に定義
- ✅ コミット前にlintとtypecheckを実行
- ✅ 新機能には必ずテストを追加
- ✅ ドキュメントを最新に保つ

## 🔗 詳細情報へのリンク

- **全体的なガイドライン**: [CLAUDE.md](../CLAUDE.md)
- **アーキテクチャ詳細**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **メンテナンス手順**: [MAINTENANCE.md](./MAINTENANCE.md)
- **テスト戦略**: [test-strategy.md](./test-strategy.md)

## 💡 トラブルシューティング

### ポートが使用中
```bash
# 自動的に空きポートを検出
npm run dev:auto-port
```

### 型エラーが発生
1. `npm run typecheck`で詳細を確認
2. VSCodeのTypeScriptエラーを確認
3. 必要に応じて型定義を追加

### テストが失敗
1. `npm run test:unit -- --watch`で対話的にデバッグ
2. `npm run test:e2e -- --headed`でブラウザを表示してデバッグ