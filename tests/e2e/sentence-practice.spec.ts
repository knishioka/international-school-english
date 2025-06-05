import { test, expect } from '@playwright/test';

test.describe('Sentence Practice Game', () => {
  test('should verify server is running and sentence practice is working', async ({ page }) => {
    // 1. Verify the server is running on http://localhost:3000
    await page.goto('http://localhost:3000');
    await expect(page).toHaveURL('http://localhost:3000/');

    // 2. Verify the welcome page loads correctly
    // The page starts in Japanese, so we need to switch to English first
    await page.waitForSelector('button:has-text("English")');
    await page.click('button:has-text("English")');
    await expect(page.locator('h1')).toContainText('Welcome to English Learning!');

    // Enter a name to proceed
    await page.fill('input[placeholder="Enter your name"]', 'Test Student');
    await page.click('button:has-text("Let\'s Play!")');

    // Should navigate to home page
    await expect(page).toHaveURL('http://localhost:3000/home');
    await expect(page.locator('h1')).toContainText('Hello, Test Student!');

    // 3. Navigate to the sentence practice game and check that it shows "Sentence Practice"
    // Click on the sentence practice game card
    await page.click('div:has-text("Sentence Practice")');

    // Verify we're on the vocabulary game page
    await expect(page).toHaveURL('http://localhost:3000/games/vocabulary');

    // Verify it shows "Sentence Practice" instead of single words
    await expect(page.locator('h1')).toContainText('Sentence Practice');

    // Verify the emoji is present
    await expect(page.locator('h1')).toContainText('📝');

    // Verify that sentence cards are displayed
    const sentenceCards = page
      .locator('button')
      .filter({ hasText: 'I eat breakfast every morning.' });
    await expect(sentenceCards).toBeVisible();

    // Click on a sentence to start the game
    await sentenceCards.click();

    // Verify the game interface is shown
    await expect(page.locator('text=Select words to make a sentence')).toBeVisible();

    // 4. Take a screenshot of the new sentence practice game
    await page.screenshot({
      path: 'tests/screenshots/sentence-practice-game.png',
      fullPage: true,
    });

    // Additional verification: Check that words can be selected
    // The game should show shuffled words
    const wordButtons = page.locator('button').filter({ hasText: 'I' });
    await expect(wordButtons.first()).toBeVisible();

    // Verify the Japanese translation is shown
    await expect(page.locator('text=わたしは まいあさ あさごはんを たべます。')).toBeVisible();
  });

  test('should allow word selection and answer checking', async ({ page }) => {
    // Navigate to the game
    await page.goto('http://localhost:3000');
    await page.click('button:has-text("English")');
    await page.fill('input[placeholder="Enter your name"]', 'Test Student');
    await page.click('button:has-text("Let\'s Play!")');
    await page.click('div:has-text("Sentence Practice")');

    // Select a sentence
    await page.click('button:has-text("My mother makes delicious cookies.")');

    // Build the sentence by clicking words in order
    // Wait for the words to be visible
    await page.waitForSelector('button:has-text("My")');
    await page.click('button:has-text("My")');
    await page.click('button:has-text("mother")');
    await page.click('button:has-text("makes")');
    await page.click('button:has-text("delicious")');
    await page.click('button:has-text("cookies")');

    // Check the answer
    await page.click('button:has-text("Check Answer")');

    // Take a screenshot of the answer result (punctuation bug is now fixed)
    await page.screenshot({
      path: 'tests/screenshots/sentence-practice-answer-result.png',
      fullPage: true,
    });

    // The punctuation bug has been fixed - the game now correctly ignores punctuation when comparing answers
    // So we should see the "Correct!" message
    await expect(page.locator('text=Correct! 🎉')).toBeVisible();
  });

  test('should show hint functionality', async ({ page }) => {
    // Navigate to the game
    await page.goto('http://localhost:3000');
    await page.click('button:has-text("English")');
    await page.fill('input[placeholder="Enter your name"]', 'Test Student');
    await page.click('button:has-text("Let\'s Play!")');
    await page.click('div:has-text("Sentence Practice")');

    // Select a sentence
    await page.click('button:has-text("Beautiful flowers bloom in the spring.")');

    // Click hint button
    await page.click('button:has-text("Hint")');

    // Verify the English sentence is shown as a hint
    await expect(page.locator('text=Beautiful flowers bloom in the spring.')).toBeVisible();

    // Take a screenshot with hint shown
    await page.screenshot({
      path: 'tests/screenshots/sentence-practice-hint.png',
      fullPage: true,
    });
  });
});
