import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: process.env.CI ? 15 * 1000 : 30 * 1000, // CIでは15秒に短縮
  expect: {
    timeout: process.env.CI ? 3000 : 5000, // CIでは3秒に短縮
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // リトライを無効化
  workers: process.env.CI ? 2 : undefined, // CIで2ワーカーに制限
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: process.env.CI ? 'off' : 'on-first-retry', // CIではトレース無効
    screenshot: 'off', // スクリーンショット無効
    video: 'off', // ビデオ録画無効
    actionTimeout: process.env.CI ? 5 * 1000 : 10 * 1000, // CIでは5秒
    navigationTimeout: process.env.CI ? 10 * 1000 : 30 * 1000, // CIでは10秒
  },

  projects: [
    // Chromiumのみでテスト実行
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
