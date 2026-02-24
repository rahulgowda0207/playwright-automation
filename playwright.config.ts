import { defineConfig, devices } from '@playwright/test';
import { config } from './config/configLoader';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Per-test timeout (ms)
  timeout: 30000,

  // Assertion timeout
  expect: {
    timeout: 10000,
  },

  reporter: [
    ['html'],
    ['./utils/CustomReporter.ts'],
  ],

  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry',
    // Capture a screenshot only when a test fails (avoids disk bloat)
    screenshot: 'only-on-failure',
    // Per-action and per-navigation timeouts (independent of the test timeout)
    actionTimeout: 10000,
    navigationTimeout: 30000,
    // headless intentionally omitted — Playwright defaults to true;
    // override at runtime with: npx playwright test --headed
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
