import { test, expect } from '@playwright/test';

test.describe('Updated App Features', () => {
  test('should show updated home page with kanji selector and 2 games', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // App starts in Japanese by default, no need to switch

    // Enter name
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト生徒');
    await page.click('button:has-text("あそぼう！")');

    // Verify on home page
    await expect(page).toHaveURL('http://localhost:3000/home');

    // Verify kanji grade selector is visible (only in Japanese)
    await expect(page.locator('text=かんじレベル:')).toBeVisible();
    const kanjiSelector = page.locator('select').first();
    await expect(kanjiSelector).toBeVisible();

    // Verify only 2 games are shown (no alphabet game)
    const gameCards = page.locator('div[class*="bg-"][class*="-100"]');
    await expect(gameCards).toHaveCount(2);

    // Verify vocabulary and stories games exist
    await expect(page.locator('text=ぶんしょう れんしゅう')).toBeVisible();
    await expect(page.locator('text=おはなし')).toBeVisible();

    // Verify alphabet game does not exist
    await expect(page.locator('text=アルファベット')).not.toBeVisible();

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/updated-home-page.png',
      fullPage: true,
    });
  });

  test('should show educational stories with kanji levels', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Navigate to stories (app starts in Japanese)
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト生徒');
    await page.click('button:has-text("あそぼう！")');
    await page.click('div:has-text("おはなし")');

    // Verify on stories page
    await expect(page).toHaveURL('http://localhost:3000/games/stories');

    // Verify new story titles
    await expect(page.locator('text=やさしいうさぎ')).toBeVisible();
    await expect(page.locator('text=あめのあとのにじ')).toBeVisible();

    // Verify story descriptions
    await expect(page.locator('text=やさしさと わけあうことを まなぼう')).toBeVisible();
    await expect(page.locator('text=てんきと こまったあとの うつくしさを まなぼう')).toBeVisible();

    // Click on first story
    await page.click('button:has-text("やさしいうさぎ")');

    // Verify story content is displayed
    await expect(
      page.locator('text=むかしむかし、もりに 白いうさぎが すんでいました。'),
    ).toBeVisible();

    // Take screenshot
    await page.screenshot({
      path: 'tests/screenshots/educational-story.png',
      fullPage: true,
    });
  });

  test('kanji selector should only appear in Japanese mode', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Start in English mode
    await page.click('button:has-text("English")');
    await page.fill('input[placeholder="Enter your name"]', 'Test Student');
    await page.click('button:has-text("Let\'s Play!")');

    // Verify kanji selector is not visible in English mode
    await expect(page.locator('text=かんじレベル:')).not.toBeVisible();

    // Switch to Japanese using language toggle on Welcome page
    await page.goto('http://localhost:3000');
    // App starts in Japanese, so just fill the form
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト生徒');
    await page.click('button:has-text("あそぼう！")');

    // Verify kanji selector is visible in Japanese mode
    await expect(page.locator('text=かんじレベル:')).toBeVisible();
  });
});
