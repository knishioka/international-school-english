import { test, expect } from '@playwright/test';

test.describe('Kanji Level Functionality', () => {
  test('should display different Japanese text based on kanji grade selection', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000');

    // App starts in Japanese, enter name
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト生徒');
    await page.click('button:has-text("あそぼう！")');

    // Verify on home page
    await expect(page).toHaveURL('http://localhost:3000/home');

    // Check default grade (1)
    const kanjiSelector = page.locator('select').first();
    await expect(kanjiSelector).toHaveValue('1');

    // Navigate to sentence practice game
    await page.click('div:has-text("ぶんしょう れんしゅう")');
    await expect(page).toHaveURL('http://localhost:3000/games/vocabulary');

    // First sentence should show grade 1 kanji (mostly hiragana)
    await expect(page.locator('text=わたしは まいあさ あさごはんを たべます。')).toBeVisible();

    // Go back and change kanji level
    await page.click('button[aria-label="Back to home"]');

    // Change to grade 3
    await kanjiSelector.selectOption('3');
    await expect(kanjiSelector).toHaveValue('3');

    // Go back to sentence practice
    await page.click('div:has-text("ぶんしょう れんしゅう")');

    // Should now show grade 3 kanji
    await expect(page.locator('text=私は 毎朝 朝ごはんを 食べます。')).toBeVisible();

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/kanji-grade-3.png',
      fullPage: true,
    });

    // Go back and change to grade 6
    await page.click('button[aria-label="Back to home"]');
    await kanjiSelector.selectOption('6');

    // Check stories page with different kanji levels
    await page.click('div:has-text("おはなし")');
    await page.click('button:has-text("やさしいうさぎ")');

    // Should show grade 6 kanji version
    await expect(page.locator('text=昔々、森に 白いうさぎが 住んでいました。')).toBeVisible();

    await page.screenshot({
      path: 'tests/screenshots/story-kanji-grade-6.png',
      fullPage: true,
    });
  });

  test('should remember kanji grade selection across pages', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Enter name
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト生徒');
    await page.click('button:has-text("あそぼう！")');

    // Set kanji grade to 4
    const kanjiSelector = page.locator('select').first();
    await kanjiSelector.selectOption('4');

    // Navigate to sentence practice
    await page.click('div:has-text("ぶんしょう れんしゅう")');

    // Select a sentence to play
    await page.click('button:has-text("私は 毎朝 朝ご飯を 食べます。")');

    // Verify grade 4 kanji is shown in game
    await expect(
      page.locator('.text-xl').filter({ hasText: '私は 毎朝 朝ご飯を 食べます。' }),
    ).toBeVisible();

    // Go back to home
    await page.click('button[aria-label="Back to home"]');
    await page.click('button[aria-label="Back to home"]');

    // Verify grade 4 is still selected
    await expect(kanjiSelector).toHaveValue('4');
  });
});
