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
    await page.click('text=ぶんしょうれんしゅう');
    await expect(page.getByText('私は 毎朝 朝ごはんを 食べます。')).toBeVisible();
  });
});
