# Contributing to International School English Learning App

このプロジェクトへの貢献を歓迎します！以下のガイドラインに従ってください。

## 開発環境のセットアップ

### 必要条件
- Node.js 18.x以上
- npm 9.x以上
- Git

### 初期設定
```bash
# リポジトリのクローン
git clone [repository-url]
cd international-school-english

# 依存関係のインストール
npm install

# Husky（Git hooks）のセットアップ
npm run prepare

# 開発サーバーの起動
npm run dev
```

## 開発フロー

### 1. ブランチの作成
```bash
# 最新のdevelopブランチから作成
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 2. 開発前のチェック
```bash
# すべてのテストが通ることを確認
npm run test
npm run lint
npm run typecheck
```

### 3. コミット前の確認
commit時に自動的に以下が実行されます：
- ESLint
- Prettier
- TypeScript型チェック
- ユニットテスト

手動で実行する場合：
```bash
npm run pre-commit
```

### 4. コミットメッセージ
```
<type>(<scope>): <subject>

<body>

<footer>
```

例：
```
feat(game): add drag-and-drop word matching game

- Implemented new interactive game component
- Added sound effects for correct/incorrect answers
- Created progress tracking for game completion

Closes #123
```

### 5. プルリクエスト
- developブランチに対してPRを作成
- PRテンプレートに従って記入
- すべてのCIチェックが通ることを確認

## コーディング標準

### TypeScript
```typescript
// ✅ 良い例
interface GameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

// ❌ 悪い例
interface GameProps {
  difficulty: any;
  onComplete: Function;
}
```

### React コンポーネント
```tsx
// ✅ 良い例
export const GameCard: React.FC<GameCardProps> = ({ title, image, onClick }) => {
  const handleClick = useCallback(() => {
    playSound('click');
    onClick();
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className="game-card"
      aria-label={`Select ${title}`}
    >
      <img src={image} alt={title} />
      <span>{title}</span>
    </button>
  );
};

// ❌ 悪い例
export function GameCard(props) {
  return <div onClick={props.onClick}>{props.title}</div>;
}
```

## テストの書き方

### ユニットテスト
```typescript
// utils/score.test.ts
describe('calculateScore', () => {
  it('should calculate correct score with time bonus', () => {
    const result = calculateScore({
      correct: 8,
      total: 10,
      timeSpent: 30,
    });
    expect(result).toBe(850); // 80% + time bonus
  });
});
```

### E2Eテスト（Playwright）
```typescript
// tests/e2e/game-flow.spec.ts
test('complete alphabet game flow', async ({ page }) => {
  await page.goto('/games/alphabet');
  
  // ゲーム開始
  await page.click('[data-testid="start-game"]');
  
  // 文字をクリック
  await page.click('[data-testid="letter-A"]');
  
  // 音声が再生されることを確認
  await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
  
  // 正解のフィードバック
  await expect(page.locator('.success-message')).toContainText('Great job!');
});
```

## ディレクトリ構造

```
src/
├── components/          # 再利用可能なコンポーネント
│   ├── common/         # 汎用コンポーネント
│   ├── games/          # ゲーム固有のコンポーネント
│   └── layout/         # レイアウトコンポーネント
├── hooks/              # カスタムフック
├── pages/              # ページコンポーネント
├── services/           # ビジネスロジック・API
│   ├── audio/          # 音声管理
│   ├── storage/        # LocalStorage管理
│   └── progress/       # 進捗トラッキング
├── stores/             # Zustand ストア
├── utils/              # ユーティリティ関数
└── types/              # TypeScript型定義
```

## パフォーマンス最適化

### 画像の最適化
```tsx
// 適切なサイズと形式を使用
import letterA from '@/assets/images/letters/a.webp';

// 遅延読み込み
<img src={letterA} loading="lazy" alt="Letter A" />
```

### コンポーネントの最適化
```tsx
// メモ化を適切に使用
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    processData(data), [data]
  );
  
  return <div>{processedData}</div>;
});
```

## アクセシビリティ

### 必須要件
- すべてのインタラクティブ要素にaria-label
- キーボードナビゲーション対応
- 適切な色コントラスト（WCAG AA準拠）
- フォーカス表示の明確化

```tsx
// ✅ 良い例
<button
  aria-label="Play letter A sound"
  className="letter-button"
  onKeyDown={handleKeyPress}
>
  A
</button>
```

## デバッグ

### 開発ツール
```bash
# React DevToolsの有効化
npm run dev -- --debug

# Playwrightのデバッグモード
npm run test:e2e -- --debug
```

### ログレベル
```typescript
// 開発環境のみでログ出力
if (process.env.NODE_ENV === 'development') {
  console.log('[GameService]', 'Starting new game', { difficulty });
}
```

## リリースプロセス

1. feature/* → develop へのPR
2. すべてのテストが通過
3. コードレビューの承認
4. develop → main へのリリースPR
5. 自動デプロイ

## トラブルシューティング

### よくある問題

#### npm install が失敗する
```bash
# キャッシュをクリア
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### テストが失敗する
```bash
# Playwrightブラウザの再インストール
npx playwright install
```

#### 開発サーバーが起動しない
```bash
# ポートを変更
npm run dev -- --port 3001
```

## 質問・サポート

- バグ報告: GitHubのIssuesへ
- 機能提案: Discussionsで議論
- 緊急の問題: メンテナーに直接連絡

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。