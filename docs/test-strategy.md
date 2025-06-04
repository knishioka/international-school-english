# テスト戦略ドキュメント

## 概要

このドキュメントは、Grade 1 English Learning Appのテスト戦略と実装ガイドラインを定義します。
子ども向けアプリケーションとして、品質と信頼性を最優先事項として扱います。

## テストピラミッド

```
         /\
        /E2\        <- E2Eテスト (10%)
       /----\          ユーザーフロー、クリティカルパス
      /統合テ\      <- 統合テスト (20%)
     /--------\        コンポーネント間の連携
    /ユニットテ\    <- ユニットテスト (70%)
   /------------\      個別関数、コンポーネント
```

## テストの種類

### 1. ユニットテスト

#### 対象
- ユーティリティ関数
- カスタムフック
- 純粋なビジネスロジック
- 個別のReactコンポーネント

#### ツール
- **Jest**: テストランナー
- **React Testing Library**: コンポーネントテスト
- **MSW**: APIモック

#### 実装例
```typescript
// src/utils/score.test.ts
import { calculateScore } from './score';

describe('calculateScore', () => {
  it('基本スコアを正しく計算する', () => {
    expect(calculateScore({ correct: 8, total: 10 })).toBe(80);
  });

  it('時間ボーナスを適用する', () => {
    expect(calculateScore({ 
      correct: 8, 
      total: 10, 
      timeSpent: 30,
      timeLimit: 60 
    })).toBe(90); // 80 + 10 bonus
  });

  it('最大スコアを超えない', () => {
    expect(calculateScore({ 
      correct: 10, 
      total: 10, 
      timeSpent: 1,
      timeLimit: 60 
    })).toBe(100);
  });
});
```

```typescript
// src/components/GameCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { GameCard } from './GameCard';

describe('GameCard', () => {
  const mockOnClick = jest.fn();
  
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('カードの内容を表示する', () => {
    render(
      <GameCard 
        title="Apple" 
        image="/apple.png" 
        onClick={mockOnClick} 
      />
    );
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByAltText('Apple')).toHaveAttribute('src', '/apple.png');
  });

  it('クリック時にコールバックを実行する', () => {
    render(
      <GameCard 
        title="Apple" 
        image="/apple.png" 
        onClick={mockOnClick} 
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('アクセシビリティ属性を持つ', () => {
    render(
      <GameCard 
        title="Apple" 
        image="/apple.png" 
        onClick={mockOnClick} 
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Select Apple');
  });
});
```

### 2. 統合テスト

#### 対象
- 複数コンポーネントの連携
- カスタムフックとコンポーネントの統合
- 状態管理との連携

#### 実装例
```typescript
// src/features/alphabet-game/AlphabetGame.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlphabetGame } from './AlphabetGame';
import { GameProvider } from '@/contexts/GameContext';
import { AudioProvider } from '@/contexts/AudioContext';

const AllTheProviders = ({ children }) => {
  return (
    <AudioProvider>
      <GameProvider>
        {children}
      </GameProvider>
    </AudioProvider>
  );
};

describe('AlphabetGame Integration', () => {
  it('完全なゲームフローが動作する', async () => {
    render(<AlphabetGame />, { wrapper: AllTheProviders });
    
    // ゲーム開始
    fireEvent.click(screen.getByText('Start Game'));
    
    // 文字が表示される
    await waitFor(() => {
      expect(screen.getByTestId('letter-display')).toBeInTheDocument();
    });
    
    // 正しい答えを選択
    const correctAnswer = screen.getByTestId('correct-answer');
    fireEvent.click(correctAnswer);
    
    // スコアが更新される
    await waitFor(() => {
      expect(screen.getByText(/Score: 10/)).toBeInTheDocument();
    });
    
    // 次の問題に進む
    expect(screen.getByTestId('letter-display')).toHaveTextContent(/[B-Z]/);
  });
});
```

### 3. E2Eテスト (Playwright)

#### 対象
- クリティカルなユーザーフロー
- 複数ページにまたがる操作
- 実際のブラウザでの動作確認

#### テストシナリオ
1. 初回起動フロー
2. 完全なゲームプレイ
3. 進捗の保存と復元
4. 言語切り替え
5. オフライン動作

#### 実装例
```typescript
// tests/e2e/critical-user-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Critical User Journey', () => {
  test('初回ユーザーが最初のゲームを完了できる', async ({ page }) => {
    // アプリにアクセス
    await page.goto('/');
    
    // ウェルカム画面が表示される
    await expect(page.locator('h1')).toContainText('Welcome to English Learning!');
    
    // 言語選択（日本語）
    await page.click('[data-testid="language-ja"]');
    
    // 名前入力
    await page.fill('[data-testid="name-input"]', 'たろう');
    await page.click('[data-testid="start-button"]');
    
    // ホーム画面に遷移
    await expect(page).toHaveURL('/home');
    await expect(page.locator('[data-testid="greeting"]')).toContainText('こんにちは、たろうさん！');
    
    // アルファベットゲームを選択
    await page.click('[data-testid="game-alphabet"]');
    
    // ゲーム画面に遷移
    await expect(page).toHaveURL('/games/alphabet');
    
    // ゲーム開始
    await page.click('[data-testid="start-game"]');
    
    // 10問回答（簡略化）
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="correct-answer"]');
      await page.waitForTimeout(500); // アニメーション待機
    }
    
    // 結果画面
    await expect(page.locator('[data-testid="game-complete"]')).toBeVisible();
    await expect(page.locator('[data-testid="final-score"]')).toContainText('100');
    
    // ホームに戻る
    await page.click('[data-testid="back-to-home"]');
    
    // 進捗が保存されている
    await expect(page.locator('[data-testid="alphabet-progress"]')).toContainText('完了');
  });

  test('オフラインでも基本機能が動作する', async ({ page, context }) => {
    // アプリにアクセスして初期化
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // オフラインモードに切り替え
    await context.setOffline(true);
    
    // ページをリロード
    await page.reload();
    
    // アプリが表示される（Service Worker経由）
    await expect(page.locator('h1')).toBeVisible();
    
    // ゲームが実行できる
    await page.click('[data-testid="game-vocabulary"]');
    await expect(page).toHaveURL('/games/vocabulary');
  });
});
```

## テストカバレッジ目標

| 種類 | 目標 | 最小要件 |
|------|------|----------|
| ユニットテスト | 90% | 80% |
| 統合テスト | 70% | 60% |
| E2Eテスト | クリティカルパス100% | - |

## パフォーマンステスト

### Lighthouse CI設定
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "interactive": ["error", {"maxNumericValue": 3000}],
        "uses-webp-images": "error",
        "offscreen-images": "error"
      }
    }
  }
}
```

## アクセシビリティテスト

### 自動テスト
```typescript
// setupTests.ts
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// コンポーネントテストでの使用
it('アクセシビリティ違反がない', async () => {
  const { container } = render(<GameCard {...props} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 手動テスト項目
- [ ] キーボードのみでの操作
- [ ] スクリーンリーダーでの読み上げ
- [ ] 色覚多様性シミュレーション
- [ ] 拡大表示での表示崩れ

## ビジュアルリグレッションテスト

### Playwright Screenshots
```typescript
test('ゲーム画面のビジュアルが崩れていない', async ({ page }) => {
  await page.goto('/games/alphabet');
  await expect(page).toHaveScreenshot('alphabet-game.png', {
    fullPage: true,
    animations: 'disabled'
  });
});
```

## セキュリティテスト

### 自動チェック
- npm audit（CI/CDで実行）
- OWASP依存関係チェック
- コンテンツセキュリティポリシー（CSP）検証

### 手動チェック項目
- [ ] LocalStorageに機密情報が保存されていない
- [ ] XSS脆弱性がない
- [ ] 外部リソースの読み込みが適切に制限されている

## モバイルデバイステスト

### 対象デバイス
- iPhone 12/13/14 (Safari)
- iPad (Safari)
- Android主要機種 (Chrome)

### テスト項目
- [ ] タッチ操作の反応性
- [ ] 画面回転時の表示
- [ ] 仮想キーボード表示時のレイアウト
- [ ] 音声再生の動作

## テスト実行コマンド

```bash
# すべてのテスト実行
npm test

# ユニットテストのみ
npm run test:unit

# ユニットテスト（監視モード）
npm run test:unit:watch

# E2Eテスト
npm run test:e2e

# E2Eテスト（ヘッドレス）
npm run test:e2e:headless

# E2Eテスト（デバッグモード）
npm run test:e2e:debug

# カバレッジレポート生成
npm run test:coverage

# アクセシビリティテスト
npm run test:a11y
```

## CI/CD統合

### プルリクエスト時
1. ユニットテスト実行
2. 統合テスト実行
3. E2Eテスト（主要フローのみ）
4. カバレッジチェック
5. Lighthouseパフォーマンステスト

### マージ時
1. 全E2Eテスト実行
2. ビジュアルリグレッションテスト
3. セキュリティスキャン

### デプロイ前
1. 本番環境相当でのE2Eテスト
2. 負荷テスト（必要に応じて）

## トラブルシューティング

### テストが不安定な場合
```typescript
// waitForを使用して要素の出現を待つ
await waitFor(() => {
  expect(screen.getByText('Loading...')).not.toBeInTheDocument();
});

// Playwrightでの待機
await page.waitForSelector('[data-testid="content"]', { state: 'visible' });
```

### モックの設定
```typescript
// 音声APIのモック
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  addEventListener: jest.fn(),
}));
```

## ベストプラクティス

1. **テストの独立性**: 各テストは他のテストに依存しない
2. **明確な命名**: 日本語でのテスト名を推奨
3. **AAA原則**: Arrange, Act, Assert
4. **テストデータ**: ファクトリー関数を使用
5. **待機処理**: 明示的な待機を使用（暗黙的な待機を避ける）