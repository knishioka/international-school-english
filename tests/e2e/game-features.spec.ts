import { test, expect } from '@playwright/test';

test.describe('International School English Game Features', () => {
  test('should test all game features end-to-end', async ({ page }) => {
    // Set a longer timeout for this comprehensive test
    test.setTimeout(60000);

    // 1. Navigate to the welcome page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Take screenshot of welcome page
    await page.screenshot({ path: 'screenshots/1-welcome-page.png', fullPage: true });

    // Verify welcome page elements
    await expect(page.locator('h1')).toContainText('Welcome');
    await expect(page.getByPlaceholder('Enter your name')).toBeVisible();
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible();

    // 2. Enter a name and go to home
    await page.fill('input[placeholder="Enter your name"]', 'TestStudent');
    await page.click('button:has-text("Start Learning!")');

    // Wait for navigation to home page
    await page.waitForURL('**/home');
    await page.waitForLoadState('networkidle');

    // Take screenshot of home page
    await page.screenshot({ path: 'screenshots/2-home-page.png', fullPage: true });

    // Verify home page elements
    await expect(page.locator('text=Hello, TestStudent!')).toBeVisible();
    await expect(page.locator('text=Choose a game to play')).toBeVisible();

    // Verify game cards are visible
    const alphabetCard = page.locator('div:has-text("Alphabet Game")').first();
    const vocabularyCard = page.locator('div:has-text("Vocabulary")').first();
    const storyCard = page.locator('div:has-text("Story Time")').first();

    await expect(alphabetCard).toBeVisible();
    await expect(vocabularyCard).toBeVisible();
    await expect(storyCard).toBeVisible();

    // 3. Test the Alphabet game
    await alphabetCard.click();
    await page.waitForURL('**/alphabet');
    await page.waitForLoadState('networkidle');

    // Take screenshot of alphabet page
    await page.screenshot({ path: 'screenshots/3-alphabet-page.png', fullPage: true });

    // Click on a letter (letter A)
    const letterA = page.locator('button:has-text("A")').first();
    await expect(letterA).toBeVisible();
    await letterA.click();

    // Wait for audio to potentially play
    await page.waitForTimeout(1000);

    // Take screenshot after clicking letter
    await page.screenshot({ path: 'screenshots/3b-alphabet-letter-clicked.png', fullPage: true });

    // Go back to home
    await page.click('button:has-text("Back to Home")');
    await page.waitForURL('**/home');

    // 4. Test the Vocabulary game
    await page.locator('div:has-text("Vocabulary")').first().click();
    await page.waitForURL('**/vocabulary');
    await page.waitForLoadState('networkidle');

    // Take screenshot of vocabulary page
    await page.screenshot({ path: 'screenshots/4-vocabulary-page.png', fullPage: true });

    // Click on a word card (first one available)
    const firstWordCard = page.locator('.cursor-pointer').first();
    await expect(firstWordCard).toBeVisible();
    await firstWordCard.click();

    // Wait for animation/audio
    await page.waitForTimeout(1000);

    // Take screenshot after clicking word
    await page.screenshot({ path: 'screenshots/4b-vocabulary-word-clicked.png', fullPage: true });

    // Go back to home
    await page.click('button:has-text("Back to Home")');
    await page.waitForURL('**/home');

    // 5. Test the Story page
    await page.locator('div:has-text("Story Time")').first().click();
    await page.waitForURL('**/stories');
    await page.waitForLoadState('networkidle');

    // Take screenshot of stories list
    await page.screenshot({ path: 'screenshots/5-stories-page.png', fullPage: true });

    // Click on the first story
    const firstStory = page.locator('.cursor-pointer').first();
    await expect(firstStory).toBeVisible();
    await firstStory.click();

    // Wait for story to load
    await page.waitForURL(/\/stories\/\d+/);
    await page.waitForLoadState('networkidle');

    // Take screenshot of story page
    await page.screenshot({ path: 'screenshots/5b-story-detail.png', fullPage: true });

    // Navigate through the story if there are multiple pages
    const nextButton = page.locator('button:has-text("Next")');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/5c-story-next-page.png', fullPage: true });
    }

    // Go back to stories list
    const backToStories = page.locator('button:has-text("Back to Stories")');
    if (await backToStories.isVisible()) {
      await backToStories.click();
    } else {
      await page.goBack();
    }

    await page.waitForURL('**/stories');

    // Go back to home
    await page.click('button:has-text("Back to Home")');
    await page.waitForURL('**/home');

    // 6. Test the Progress page
    // Look for progress link in navigation or menu
    const progressLink = page.locator('a:has-text("Progress")');
    if (await progressLink.isVisible()) {
      await progressLink.click();
    } else {
      // Try direct navigation
      await page.goto('http://localhost:3000/progress');
    }

    await page.waitForLoadState('networkidle');

    // Take screenshot of progress page
    await page.screenshot({ path: 'screenshots/6-progress-page.png', fullPage: true });

    // Verify progress page elements
    await expect(page.locator('text=/progress|achievements|score/i')).toBeVisible();

    console.log('All tests completed successfully!');
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test error handling by navigating to a non-existent route
    await page.goto('http://localhost:3000/non-existent-page');

    // Take screenshot of error state
    await page.screenshot({ path: 'screenshots/error-404.png', fullPage: true });

    // Check if app handles 404 gracefully
    const bodyText = await page.textContent('body');
    console.log('404 Page content:', bodyText);
  });
});

// Test to verify server is running
test.describe('Server Health Check', () => {
  test('should confirm development server is running', async ({ page }) => {
    try {
      const response = await page.goto('http://localhost:3000');
      expect(response?.status()).toBe(200);
      console.log('✓ Development server is running on http://localhost:3000');
    } catch (error) {
      console.error('✗ Development server is not accessible:', error);
      throw error;
    }
  });
});
