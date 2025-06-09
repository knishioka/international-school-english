# メンテナンスガイド

> **注**: AI開発アシスタント（Claude等）を使用する場合は、[CLAUDE.md](../CLAUDE.md)も併せて参照してください。

## 日常的なメンテナンス

### コンテンツの更新

#### 1. 新しい単語の追加

```typescript
// src/data/vocabularyWords.ts
{
  id: '101', // 一意のID
  english: 'butterfly',
  japanese: 'ちょうちょう',
  romaji: 'chouchou',
  category: 'animals', // 既存のカテゴリーから選択
  image: '/images/butterfly.jpg',
  emoji: '🦋',
  example: {
    english: 'The butterfly is flying.',
    japanese: 'ちょうちょうが とんでいます。',
  },
}
```

#### 2. 新しい文章の追加

```typescript
// src/data/sentences.ts
{
  id: '13', // 一意のID
  english: 'I love learning new things.',
  japanese: 'あたらしいことを まなぶのが すきです。',
  jaKanji: {
    1: 'あたらしいことを 学ぶのが すきです。',
    2: '新しいことを 学ぶのが すきです。',
    3: '新しいことを 学ぶのが 好きです。',
    4: '新しいことを 学ぶのが 好きです。',
    5: '新しいことを 学ぶのが 好きです。',
    6: '新しいことを 学ぶのが 好きです。',
  },
  words: ['I', 'love', 'learning', 'new', 'things'],
  emoji: '📚',
  category: 'school',
}
```

#### 3. 新しいカテゴリーの追加

```typescript
// src/data/categories.ts
// commonCategoriesまたはgameSpecificCategoriesに追加
{
  id: 'music',
  name: { en: 'Music', ja: 'おんがく' },
  emoji: '🎵',
  color: 'bg-purple-100'
}
```

### 定期的なチェック

#### 週次チェック
- [ ] 依存関係の脆弱性チェック: `npm audit`
- [ ] 開発環境でのテスト実行: `npm run test`
- [ ] ビルドサイズの確認: `npm run build`

#### 月次チェック
- [ ] 依存関係の更新: `npm update`
- [ ] 非推奨APIの確認
- [ ] パフォーマンス測定（Lighthouse）

### バージョン管理

#### セマンティックバージョニング
- **Major (X.0.0)**: 破壊的変更
- **Minor (0.X.0)**: 新機能追加
- **Patch (0.0.X)**: バグ修正

#### リリース手順
1. バージョン番号を更新
   ```bash
   npm version patch # または minor, major
   ```

2. 変更履歴を更新
   - CHANGELOG.mdに変更内容を記載

3. テストとビルド
   ```bash
   npm run lint && npm run typecheck && npm run test && npm run build
   ```

4. コミットとタグ付け
   ```bash
   git add .
   git commit -m "chore: release v1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```

## デバッグ手順

### 一般的な問題

#### 1. 画面が真っ白になる
- ブラウザのコンソールでエラーを確認
- LocalStorageをクリア: `localStorage.clear()`
- キャッシュをクリアして再読み込み

#### 2. 音声が再生されない
- AudioContextの初期化を確認
- ユーザージェスチャーの有無を確認
- 音声ファイルのパスを確認

#### 3. アニメーションがちらつく
- `initial={false}`が設定されているか確認
- AnimatePresenceの`mode="wait"`を確認
- keyプロパティが適切に設定されているか確認

### デバッグツール

#### React Developer Tools
- コンポーネントツリーの確認
- Props/Stateの検査
- パフォーマンスプロファイリング

#### Chrome DevTools
- Networkタブでリクエストを確認
- Performanceタブでボトルネックを特定
- Applicationタブでローカルストレージを確認

## パフォーマンスチューニング

### 測定方法

```bash
# Lighthouseでの測定
npm run build
npm run preview
# ChromeでLighthouseを実行
```

### 最適化チェックリスト

- [ ] 画像の最適化（WebP形式、適切なサイズ）
- [ ] コード分割（React.lazy）
- [ ] 不要な再レンダリングの削除
- [ ] バンドルサイズの確認

### パフォーマンス目標

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- バンドルサイズ: < 1MB (gzip後)

## セキュリティ

### 定期的なセキュリティチェック

```bash
# 脆弱性のチェック
npm audit

# 修正可能な脆弱性の自動修正
npm audit fix

# 依存関係の更新
npm update
```

### セキュリティベストプラクティス

1. **入力検証**: ユーザー入力は必ず検証
2. **XSS対策**: dangerouslySetInnerHTMLの使用禁止
3. **依存関係**: 信頼できるパッケージのみ使用
4. **環境変数**: 秘密情報は環境変数で管理

## バックアップとリカバリ

### バックアップ対象

1. **ソースコード**: Gitで管理
2. **画像/音声アセット**: Git LFSまたは外部ストレージ
3. **ユーザーデータ**: LocalStorageのエクスポート機能

### リカバリ手順

1. **コードのリカバリ**
   ```bash
   git clone <repository-url>
   npm install
   npm run dev
   ```

2. **データのリカバリ**
   - LocalStorageデータをインポート
   - アセットファイルを配置

## 監視とアラート

### エラー監視

- ブラウザコンソールエラーの定期確認
- ユーザーフィードバックの収集
- アクセスログの分析

### パフォーマンス監視

- Core Web Vitalsの定期測定
- ユーザー体験メトリクスの追跡
- ロード時間の監視

## ドキュメント管理

### 更新が必要なドキュメント

1. **技術ドキュメント**
   - ARCHITECTURE.md: 設計変更時
   - README.md: 機能追加時
   - CLAUDE.md: AI開発ガイドライン変更時

2. **ユーザードキュメント**
   - 操作マニュアル
   - FAQ
   - トラブルシューティングガイド

### ドキュメント更新のタイミング

- 新機能追加時
- 仕様変更時
- バグ修正で挙動が変わった時
- 依存関係の大幅な更新時