import { test, expect } from '@playwright/test';

test.describe('Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete progress tracking workflow', async ({ page }) => {
    // Navigate to welcome page and set username
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome');

    // Set username
    await page.fill('input[type="text"]', 'TestUser');
    await page.click('text=Start Learning');

    // Navigate to sentence practice
    await page.click('[data-testid="vocabulary-game-card"]');
    await expect(page.locator('h1')).toContainText('Sentence Practice');

    // Select first sentence
    await page.click('text=I eat breakfast every morning.');

    // Complete the sentence correctly
    const words = ['I', 'eat', 'breakfast', 'every', 'morning'];
    for (const word of words) {
      await page.click(`button:has-text("${word}")`);
    }

    // Check answer
    await page.click('text=Check Answer');
    await expect(page.locator('text=Correct!')).toBeVisible();

    // Go to next sentence
    await page.click('text=Next');

    // Go back to home
    await page.click('button[aria-label="Back to home"]');

    // Navigate to stories
    await page.click('[data-testid="story-card"]');
    await expect(page.locator('h1')).toContainText('📖');

    // Select first story
    await page.click('text=The Kind Rabbit');

    // Read through a few pages
    await page.click('button:has-text("→")');
    await page.click('button:has-text("→")');
    await page.click('button:has-text("→")');

    // Go back to home
    await page.click('button[aria-label="Back"]');
    await page.click('button[aria-label="Back"]');

    // Check progress page
    await page.click('[data-testid="progress-card"]');
    await expect(page.locator('h1')).toContainText('📊');

    // Verify progress is displayed
    await expect(page.locator('text=TestUserの')).toBeVisible();
    await expect(page.locator('text=🎯')).toBeVisible(); // Total score card
    await expect(page.locator('text=📝')).toBeVisible(); // Completed sentences card
    await expect(page.locator('text=📖')).toBeVisible(); // Stories read card

    // Check for achievements
    await expect(page.locator('text=アチーブメント')).toBeVisible();
  });

  test('progress persists across page reloads', async ({ page }) => {
    // Set username and complete a sentence
    await page.goto('/');
    await page.fill('input[type="text"]', 'TestUser');
    await page.click('text=Start Learning');

    await page.click('[data-testid="vocabulary-game-card"]');
    await page.click('text=I eat breakfast every morning.');

    const words = ['I', 'eat', 'breakfast', 'every', 'morning'];
    for (const word of words) {
      await page.click(`button:has-text("${word}")`);
    }

    await page.click('text=Check Answer');
    await expect(page.locator('text=Correct!')).toBeVisible();

    // Reload the page
    await page.reload();

    // Navigate to progress page
    await page.click('[data-testid="progress-card"]');

    // Verify progress is still there
    await expect(page.locator('text=TestUserの')).toBeVisible();
    // Should have some score from the completed sentence
    await expect(page.locator('text=🎯').locator('..').locator('text=0')).not.toBeVisible();
  });

  test('no progress tracking without username', async ({ page }) => {
    // Go directly to sentence practice without setting username
    await page.goto('/vocabulary-game');

    // Complete a sentence
    await page.click('text=I eat breakfast every morning.');

    const words = ['I', 'eat', 'breakfast', 'every', 'morning'];
    for (const word of words) {
      await page.click(`button:has-text("${word}")`);
    }

    await page.click('text=Check Answer');
    await expect(page.locator('text=Correct!')).toBeVisible();

    // Go to progress page
    await page.goto('/progress');

    // Should show loading state (no progress data)
    await expect(page.locator('text=Loading progress')).toBeVisible();
  });

  test('achievements unlock at correct milestones', async ({ page }) => {
    // Set username
    await page.goto('/');
    await page.fill('input[type="text"]', 'TestUser');
    await page.click('text=Start Learning');

    // Complete first sentence to unlock first sentence achievement
    await page.click('[data-testid="vocabulary-game-card"]');
    await page.click('text=I eat breakfast every morning.');

    const words = ['I', 'eat', 'breakfast', 'every', 'morning'];
    for (const word of words) {
      await page.click(`button:has-text("${word}")`);
    }

    await page.click('text=Check Answer');
    await expect(page.locator('text=Correct!')).toBeVisible();

    // Check progress page
    await page.click('button[aria-label="Back to home"]');
    await page.click('[data-testid="progress-card"]');

    // Should have first sentence achievement
    await expect(page.locator('text=はじめての ぶんしょう')).toBeVisible();
    await expect(page.locator('text=🌟')).toBeVisible();

    // Go back and read a story to unlock first story achievement
    await page.click('button[aria-label="Back to home"]');
    await page.click('[data-testid="story-card"]');
    await page.click('text=The Kind Rabbit');

    // Read to the end of the story
    for (let i = 0; i < 7; i++) {
      const nextButton = page.locator('button:has-text("→")');
      if (await nextButton.isEnabled()) {
        await nextButton.click();
      }
    }

    // Go back to progress page
    await page.click('button[aria-label="Back"]');
    await page.click('button[aria-label="Back"]');
    await page.click('[data-testid="progress-card"]');

    // Should now have both achievements
    await expect(page.locator('text=はじめての ぶんしょう')).toBeVisible();
    await expect(page.locator('text=はじめての おはなし')).toBeVisible();
  });

  test('score calculation works correctly', async ({ page }) => {
    // Set username
    await page.goto('/');
    await page.fill('input[type="text"]', 'TestUser');
    await page.click('text=Start Learning');

    // Complete sentence without hint (should get bonus)
    await page.click('[data-testid="vocabulary-game-card"]');
    await page.click('text=I eat breakfast every morning.');

    const words = ['I', 'eat', 'breakfast', 'every', 'morning'];
    for (const word of words) {
      await page.click(`button:has-text("${word}")`);
    }

    await page.click('text=Check Answer');
    await expect(page.locator('text=Correct!')).toBeVisible();

    // Check score in progress page
    await page.click('button[aria-label="Back to home"]');
    await page.click('[data-testid="progress-card"]');

    // Should have score of 70 (5 words * 10 + 20 bonus)
    await expect(page.locator('text=70')).toBeVisible();

    // Go back and complete another sentence with hint (should get reduced score)
    await page.click('button[aria-label="Back to home"]');
    await page.click('[data-testid="vocabulary-game-card"]');
    await page.click('text=My mother makes delicious cookies.');

    // Use hint first
    await page.click('text=Hint');

    // Then complete sentence
    const words2 = ['My', 'mother', 'makes', 'delicious', 'cookies'];
    for (const word of words2) {
      await page.click(`button:has-text("${word}")`);
    }

    await page.click('text=Check Answer');
    await expect(page.locator('text=Correct!')).toBeVisible();

    // Check updated score
    await page.click('button[aria-label="Back to home"]');
    await page.click('[data-testid="progress-card"]');

    // Should have total score of 120 (70 + 50 for second sentence without bonus)
    await expect(page.locator('text=120')).toBeVisible();
  });

  test('streak tracking works correctly', async ({ page }) => {
    // Set username
    await page.goto('/');
    await page.fill('input[type="text"]', 'TestUser');
    await page.click('text=Start Learning');

    // Complete some activities
    await page.click('[data-testid="vocabulary-game-card"]');
    await page.click('text=I eat breakfast every morning.');

    const words = ['I', 'eat', 'breakfast', 'every', 'morning'];
    for (const word of words) {
      await page.click(`button:has-text("${word}")`);
    }

    await page.click('text=Check Answer');
    await expect(page.locator('text=Correct!')).toBeVisible();

    // Check progress page for streak
    await page.click('button[aria-label="Back to home"]');
    await page.click('[data-testid="progress-card"]');

    // Should have 1 day streak
    await expect(page.locator('text=🔥').locator('..').locator('text=1')).toBeVisible();
  });
});
