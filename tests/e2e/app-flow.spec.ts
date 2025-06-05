import { test, expect } from '@playwright/test';

test.describe('基本的なアプリフロー', () => {
  test('アプリが正常に動作する', async ({ page }) => {
    // アプリにアクセス
    await page.goto('/');
    
    // ウェルカムページが表示される
    await expect(page.locator('h1')).toContainText('えいごをまなぼう！');
    
    // 名前を入力してホームに遷移
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト');
    await page.click('button:has-text("あそぼう！")');
    
    // ホームページに遷移
    await expect(page).toHaveURL('/home');
    await expect(page.locator('h1')).toContainText('こんにちは, テスト!');
    
    // ゲームカードが表示される
    await expect(page.getByText('たんごカード')).toBeVisible();
    await expect(page.getByText('ぶんしょうれんしゅう')).toBeVisible();
  });
});
