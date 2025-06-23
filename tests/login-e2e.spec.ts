import { test, expect, Page } from '@playwright/test';
import { APP_CONFIG, CREDENTIALS_CONFIG } from './config/credential';

// Helper function untuk login
async function performLogin(page: Page, email: string, password: string, expectedUrl: string) {
  await page.goto(APP_CONFIG.ROUTES.LOGIN);
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  await page.click('button[type="submit"]');
  await expect(page.locator('button[type="submit"]')).toHaveText(APP_CONFIG.UI_TEXT.LOGIN.LOADING);
  await page.waitForURL(expectedUrl, { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
  await expect(page).toHaveURL(expectedUrl);
}

// Helper function untuk setup error logging
async function setupErrorLogging(page: Page) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`Browser console error: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    console.log(`Page error: ${err.message}`);
  });
}

test.describe('E2E Halaman Login dengan API Asli', () => {
  test.beforeEach(async ({ page }) => {
    await setupErrorLogging(page);
    await page.goto(APP_CONFIG.ROUTES.LOGIN);
  });

  test('harus menampilkan elemen UI halaman login dengan benar', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText(APP_CONFIG.UI_TEXT.LOGIN.TITLE);
    await expect(page.locator(`text=${APP_CONFIG.UI_TEXT.LOGIN.SUBTITLE}`)).toBeVisible();
    await expect(page.locator('label[for="email"]')).toHaveText('Email');
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toHaveText('Password');
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText(APP_CONFIG.UI_TEXT.LOGIN.BUTTON);
    await expect(page.getByRole('tabpanel').getByRole('link', { name: 'Register' })).toBeVisible();
  });

  test('harus berhasil login sebagai borrower dan redirect ke dashboard borrower', async ({ page }) => {
    await performLogin(
      page,
      CREDENTIALS_CONFIG.LOGIN.BORROWER.email,
      CREDENTIALS_CONFIG.LOGIN.BORROWER.password,
      APP_CONFIG.ROUTES.BORROWER.DASHBOARD
    );
  });

  test('harus berhasil login sebagai lender dan redirect ke dashboard lender', async ({ page }) => {
    await performLogin(
      page,
      CREDENTIALS_CONFIG.LOGIN.LENDER.email,
      CREDENTIALS_CONFIG.LOGIN.LENDER.password,
      APP_CONFIG.ROUTES.LENDER.DASHBOARD
    );
  });

  test('harus berhasil login sebagai admin dan redirect ke dashboard admin', async ({ page }) => {
    await performLogin(
      page,
      CREDENTIALS_CONFIG.LOGIN.ADMIN.email,
      CREDENTIALS_CONFIG.LOGIN.ADMIN.password,
      APP_CONFIG.ROUTES.ADMIN.DASHBOARD
    );
  });

  test('harus menampilkan dialog kesalahan saat login gagal', async ({ page }) => {
    await page.fill('input#email', CREDENTIALS_CONFIG.LOGIN.INVALID.email);
    await page.fill('input#password', CREDENTIALS_CONFIG.LOGIN.INVALID.password);
    await page.click('button[type="submit"]');

    await expect(page.locator(`text=${APP_CONFIG.UI_TEXT.LOGIN.ERROR.TITLE}`)).toBeVisible();
    await expect(page.locator(`text=${APP_CONFIG.UI_TEXT.LOGIN.ERROR.MESSAGE}`)).toBeVisible();
    await page.click(`button:has-text("${APP_CONFIG.UI_TEXT.LOGIN.ERROR.CLOSE}")`);
    await expect(page.locator(`text=${APP_CONFIG.UI_TEXT.LOGIN.ERROR.TITLE}`)).not.toBeVisible();
  });

  test('harus memvalidasi input email dan kata sandi', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('input#email:invalid')).toBeVisible();
    await expect(page.locator('input#password:invalid')).toBeVisible();

    await page.fill('input#email', CREDENTIALS_CONFIG.REGISTER.INVALID.email);
    await page.fill('input#password', CREDENTIALS_CONFIG.LOGIN.BORROWER.password);
    await page.click('button[type="submit"]');

    await expect(page.locator('input#email:invalid')).toBeVisible();
  });
});