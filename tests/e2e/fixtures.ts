import { test as base, expect } from '@playwright/test';

/**
 * ログイン済み状態を提供するフィクスチャ
 * 各テストでログイン処理を繰り返す必要がなくなる
 */
export const test = base.extend<{ loggedInPage: typeof base }>({
  // ログイン済みの状態でテストを開始
  page: async ({ page }, use) => {
    // ウェルカムページにアクセス
    await page.goto('/');

    // ウェルカムページが表示されるまで待機
    await expect(page.locator('h1')).toContainText('えいごをまなぼう！');

    // 名前を入力してホームに遷移
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト');
    await page.click('button:has-text("あそぼう！")');

    // ホームページに遷移完了を確認
    await expect(page).toHaveURL(/\/home$/);

    // ログイン済みのページを提供
    await use(page);
  },
});

export { expect };
