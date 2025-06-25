import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: '01-login',
      testMatch: '**/login-e2e.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '02-register', 
      testMatch: '**/register-e2e.spec.ts',
      dependencies: ['01-login'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '03-loan-application',
      testMatch: '**/loan-application-e2e.spec.ts', 
      dependencies: ['02-register'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '03-loan-application2',
      testMatch: '**/loan-application2-e2e.spec.ts', 
      dependencies: ['03-loan-application'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '04-admin-approval',
      testMatch: '**/admin-loan-approval-e2e.spec.ts',
      dependencies: ['03-loan-application2'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '05-lender-funding',
      testMatch: '**/lender-loan-funding-e2e.spec.ts',
      dependencies: ['04-admin-approval'], 
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '06-borrower-payment',
      testMatch: '**/borrower-monthly-payment-e2e.spec.ts',
      dependencies: ['05-lender-funding'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
