import { defineConfig, devices } from '@playwright/test';

// E2Eテスト専用のポート（開発サーバーとは別）
const TEST_PORT = process.env.VITE_TEST_PORT || '4173';
const BASE_PATH = process.env.BASE_URL || '/international-school-english/';
const BASE_URL = `http://localhost:${TEST_PORT}${BASE_PATH}`;
const FAST_E2E = process.env.PW_FAST === 'true';
const SKIP_BUILD = process.env.PW_SKIP_BUILD === 'true';
const REUSE_SERVER = process.env.PW_REUSE_SERVER === 'true';
const NO_WEB_SERVER = process.env.PW_NO_WEB_SERVER === 'true';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: process.env.CI ? 15 * 1000 : 30 * 1000,
  expect: {
    timeout: process.env.CI ? 3000 : 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: FAST_E2E
    ? [['line']]
    : [
        ['html'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
      ],
  use: {
    baseURL: BASE_URL,
    trace: FAST_E2E ? 'off' : process.env.CI ? 'off' : 'on-first-retry',
    screenshot: 'off',
    video: 'off',
    actionTimeout: process.env.CI ? 5 * 1000 : 10 * 1000,
    navigationTimeout: process.env.CI ? 10 * 1000 : 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // E2Eテスト用に本番ビルドを提供
  webServer: NO_WEB_SERVER
    ? undefined
    : {
        command: SKIP_BUILD ? 'npm run preview:test' : 'npm run build:test && npm run preview:test',
        url: `http://localhost:${TEST_PORT}/international-school-english/`,
        reuseExistingServer: REUSE_SERVER, // Allow reusing server for fast runs
        timeout: 180 * 1000, // ビルド時間を考慮して延長
        stdout: 'pipe',
        stderr: 'pipe',
      },
});
