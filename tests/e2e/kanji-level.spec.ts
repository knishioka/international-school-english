import { test, expect } from '@playwright/test';

test.describe('漢字レベル機能', () => {
  test('漢字レベルが正常に動作する', async ({ page }) => {
    await page.goto('/');

    // 名前を入力してホームに遷移
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト');
    await page.click('button:has-text("あそぼう！")');

    // デフォルトで1年生が選択されている
    const kanjiSelector = page.locator('select').first();
    await expect(kanjiSelector).toHaveValue('1');

    // 漢字レベルを3年生に変更
    await kanjiSelector.selectOption('3');

    // 文章練習に移動して漢字が変更されているか確認
    await page.click('text=文章練習');

    // ローディングが完了するまで待つ（カテゴリーボタンが表示されるまで）
    await page.waitForSelector('text=すべて', { timeout: 10000 });

    // 3年生の漢字が使われている文章が表示されることを確認（シャッフルされているので、漢字が含まれていることを確認）
    await expect(
      page
        .locator('button')
        .filter({ hasText: /[食毎朝]/ })
        .first(),
    ).toBeVisible({ timeout: 10000 });
  });
});
