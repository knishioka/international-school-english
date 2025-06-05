import { test, expect } from '@playwright/test';

test.describe('文章練習ゲーム', () => {
  test('文章練習ゲームが動作する', async ({ page }) => {
    // アプリにアクセス
    await page.goto('/');

    // 名前を入力してホームに遷移
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト');
    await page.click('button:has-text("あそぼう！")');

    // 文章練習ゲームに移動
    await page.click('text=ぶんしょうれんしゅう');
    await expect(page).toHaveURL(/\/games\/vocabulary$/);

    // 文章カードが表示される
    await expect(page.getByText('わたしは まいあさ あさごはんを たべます。')).toBeVisible();
  });
});
