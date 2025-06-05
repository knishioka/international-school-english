import { test, expect } from '@playwright/test';

test.describe('Manual Kanji Verification', () => {
  test('capture screenshots of different kanji levels', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Enter name
    await page.fill('input[placeholder="なまえをいれてね"]', 'テスト生徒');
    await page.click('button:has-text("あそぼう！")');

    // Wait for navigation
    await page.waitForURL('**/home');

    // Capture home page with default grade 1
    await page.screenshot({
      path: 'tests/screenshots/kanji-home-grade1.png',
      fullPage: true,
    });

    // Navigate to vocabulary using the card
    const vocabCard = page.locator('.bg-secondary-100').first();
    await vocabCard.click();

    // Wait for navigation
    await page.waitForURL('**/games/vocabulary');

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Capture vocabulary page with grade 1
    await page.screenshot({
      path: 'tests/screenshots/kanji-vocab-grade1.png',
      fullPage: true,
    });

    // Go back
    await page.click('button[aria-label="Back to home"]');
    await page.waitForURL('**/home');

    // Change to grade 3
    const kanjiSelector = page.locator('select').first();
    await kanjiSelector.selectOption('3');
    await page.waitForTimeout(500);

    // Go to vocabulary again
    await vocabCard.click();
    await page.waitForURL('**/games/vocabulary');
    await page.waitForTimeout(1000);

    // Capture with grade 3
    await page.screenshot({
      path: 'tests/screenshots/kanji-vocab-grade3.png',
      fullPage: true,
    });

    // Click on first sentence
    const firstSentence = page.locator('.bg-white.rounded-2xl').first();
    await firstSentence.click();

    await page.waitForTimeout(1000);

    // Capture game screen with grade 3
    await page.screenshot({
      path: 'tests/screenshots/kanji-game-grade3.png',
      fullPage: true,
    });

    // Go back to home
    await page.click('button[aria-label="Back to home"]');
    await page.waitForURL('**/home');

    // Change to grade 6
    await kanjiSelector.selectOption('6');
    await page.waitForTimeout(500);

    // Go to stories
    const storyCard = page.locator('.bg-purple-100').first();
    await storyCard.click();
    await page.waitForURL('**/games/stories');

    // Click first story
    await page.click('button:has-text("やさしいうさぎ")');
    await page.waitForTimeout(1000);

    // Capture story with grade 6
    await page.screenshot({
      path: 'tests/screenshots/kanji-story-grade6.png',
      fullPage: true,
    });
  });
});
