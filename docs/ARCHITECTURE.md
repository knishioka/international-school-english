# アーキテクチャ設計書

## 概要

このドキュメントは、International School English Learning Appのアーキテクチャ設計と実装方針について説明します。

> **注**: AI開発アシスタント（Claude等）を使用する場合は、まず[CLAUDE.md](../CLAUDE.md)を参照してください。

## プロジェクト構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── FlashCard.tsx   # フラッシュカードコンポーネント
│   ├── GameCard.tsx    # ゲーム選択カード
│   ├── GameHeader.tsx  # ゲーム画面共通ヘッダー
│   ├── GameProgress.tsx # 進捗表示バー
│   └── CategorySelector.tsx # カテゴリー選択UI
├── contexts/           # React Context（グローバル状態管理）
│   ├── AudioContext.tsx    # 音声管理
│   └── LanguageContext.tsx # 言語切り替え・漢字レベル
├── data/              # 静的データ（コンテンツ）
│   ├── vocabularyWords.ts # 単語カードデータ
│   ├── sentences.ts      # 文章練習データ
│   ├── spellingWords.ts  # スペリングデータ
│   ├── stories.ts        # お話データ
│   └── categories.ts     # カテゴリー定義
├── hooks/             # カスタムフック
│   ├── useGameState.ts   # ゲーム状態管理
│   ├── useGameNavigation.ts # ゲーム内ナビゲーション
│   └── useCategory.ts    # カテゴリー管理
├── pages/             # ページコンポーネント
│   ├── WelcomePage.tsx   # ウェルカム画面
│   ├── HomePage.tsx      # ホーム画面
│   ├── FlashCardPage.tsx # フラッシュカード
│   ├── VocabularyGamePage.tsx # 文章練習
│   ├── SpellingGamePage.tsx   # スペリング
│   └── StoryPage.tsx     # お話
├── services/          # ビジネスロジック
│   └── progressService.ts # 進捗管理
├── types/             # TypeScript型定義
│   └── vocabulary.ts     # 共通型定義
└── utils/             # ユーティリティ関数
    ├── arrayUtils.ts     # 配列操作
    └── kanjiValidator.ts # 漢字検証

```

## 設計原則

### 1. コンポーネント設計

- **Atomic Design**: 小さな部品から大きなコンポーネントを構成
- **単一責任の原則**: 各コンポーネントは1つの役割のみ
- **Props Interface**: すべてのPropsは明示的に型定義

### 2. データ管理

- **静的データの分離**: コンテンツはコンポーネントから独立
- **型安全性**: すべてのデータ構造はTypeScriptで厳密に型定義
- **カテゴリー共通化**: ゲーム間で共通のカテゴリーシステム

### 3. 状態管理

- **Local State**: コンポーネント固有の状態はuseStateで管理
- **Global State**: 言語設定、音声設定はContext APIで共有
- **永続化**: 進捗データはLocalStorageに保存

### 4. パフォーマンス最適化

- **遅延読み込み**: React.lazyでページコンポーネントを分割
- **メモ化**: useMemo/useCallbackで不要な再レンダリングを防止
- **アニメーション**: Framer Motionでinitial={false}を使用してちらつき防止

## 実装パターン

### データファイルの構造

```typescript
// データエクスポート
export const data: DataType[] = [...];

// カテゴリー定義
export const categories: Category[] = [...];

// フィルタリング関数
export function getDataByCategory(category: string): DataType[] {
  // 実装
}

// ユーティリティ関数
export function getCategories(): string[] {
  // 実装
}
```

### カスタムフックパターン

```typescript
export function useGameState<T>(initialData: T[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const next = () => { /* 実装 */ };
  const previous = () => { /* 実装 */ };
  
  return {
    current: initialData[currentIndex],
    currentIndex,
    score,
    next,
    previous,
  };
}
```

### コンポーネント構造

```typescript
interface ComponentProps {
  // 明示的なProps定義
}

export function Component({ ...props }: ComponentProps) {
  // フックの使用
  const { language } = useLanguage();
  
  // ローカル状態
  const [state, setState] = useState();
  
  // イベントハンドラー
  const handleClick = () => { /* 実装 */ };
  
  // レンダリング
  return (
    <div>
      {/* UI実装 */}
    </div>
  );
}
```

## メンテナンスガイド

### 新しいコンテンツの追加

1. **単語を追加する場合**
   - `/src/data/vocabularyWords.ts`に新しい単語オブジェクトを追加
   - 必要に応じて新しいカテゴリーを`categories.ts`に追加

2. **文章を追加する場合**
   - `/src/data/sentences.ts`に新しい文章オブジェクトを追加
   - 各漢字レベルの表記を忘れずに設定

3. **ストーリーを追加する場合**
   - `/src/data/stories.ts`に新しいストーリーオブジェクトを追加
   - 各ページと漢字レベル別の表記を設定

### コンポーネントの修正

1. **UIの変更**
   - 該当するコンポーネントファイルを直接編集
   - 共通UIの場合は`/src/components/`内のコンポーネントを修正

2. **ロジックの変更**
   - ゲームロジックは`/src/hooks/`内のカスタムフックを修正
   - データ処理は`/src/utils/`内のユーティリティを修正

### テストとデバッグ

1. **ユニットテスト**
   ```bash
   npm run test:unit
   ```

2. **E2Eテスト**
   ```bash
   npm run test:e2e
   ```

3. **型チェック**
   ```bash
   npm run typecheck
   ```

### デプロイ前チェックリスト

- [ ] ESLintエラーがないこと（`npm run lint`）
- [ ] TypeScriptエラーがないこと（`npm run typecheck`）
- [ ] すべてのテストがパスすること（`npm run test`）
- [ ] ビルドが成功すること（`npm run build`）
- [ ] バンドルサイズが1MB以下であること

## ベストプラクティス

### コード品質

1. **型安全性**: anyの使用禁止、明示的な型定義
2. **エラーハンドリング**: try-catchで適切にエラー処理
3. **コメント**: 複雑なロジックには説明コメントを追加

### パフォーマンス

1. **画像最適化**: WebP形式を優先使用
2. **遅延読み込み**: 大きなコンポーネントはlazy loadingを適用
3. **キャッシュ**: 静的アセットは適切にキャッシュ設定

### アクセシビリティ

1. **ARIA属性**: 適切なaria-labelを設定
2. **キーボード操作**: すべての機能をキーボードで操作可能に
3. **色のコントラスト**: WCAG基準を満たす色使い

## トラブルシューティング

### よくある問題と解決方法

1. **ポート競合**
   ```bash
   # 自動的に空きポートを検出
   npm run dev:auto-port
   ```

2. **型エラー**
   - `tsconfig.json`の設定を確認
   - 型定義ファイルが正しくインポートされているか確認

3. **ビルドエラー**
   - node_modulesを削除して再インストール
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 今後の拡張計画

1. **オフライン対応の強化**
   - Service Workerでのキャッシュ戦略改善
   - オフライン時のデータ同期

2. **多言語対応**
   - 中国語、韓国語などの追加
   - 言語別のコンテンツ管理システム

3. **分析機能**
   - 学習進捗の詳細分析
   - 苦手分野の自動検出