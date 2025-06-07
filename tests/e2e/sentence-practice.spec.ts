import { test, expect } from '@playwright/test';

test.describe('文章練習ゲーム', () => {
  test('文章練習ゲームが動作する', async ({ page }) => {
    // アプリにアクセス
    await page.goto('/');

    // 名前を入力してホームに遷移
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト');
    await page.click('button:has-text("あそぼう！")');

    // 文章練習ゲームに移動（漢字レベルによって表示が変わる）
    await page.click('text=/ぶんしょうれんしゅう|文しょうれんしゅう|文章練習/');
    await expect(page).toHaveURL(/\/games\/vocabulary$/);

    // 文章カードが表示される（シャッフルされているので特定の文章ではなく、何か文章があることを確認）
    await expect(page.locator('button').filter({ hasText: /。$/ }).first()).toBeVisible();
  });
});
