// test/login-e2e.spec.js
import { test, expect } from '@playwright/test';
import { BASE_URL, loginCredentials } from './config/credential';

test.describe('E2E Halaman Login dengan API Asli', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test('harus menampilkan elemen UI halaman login dengan benar', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Welcome back');
    await expect(page.locator('text=Enter your credentials to access your account')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toHaveText('Email');
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('label[for="password"]')).toHaveText('Password');
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Login');
    await expect(page.getByRole('tabpanel').getByRole('link', { name: 'Register' })).toBeVisible();
  });

  test('harus berhasil login sebagai borrower dan redirect ke dashboard borrower', async ({ page }) => {
    await page.fill('input#email', loginCredentials.borrower.email);
    await page.fill('input#password', loginCredentials.borrower.password);
    await page.click('button[type="submit"]');

    await expect(page.locator('button[type="submit"]')).toHaveText('Logging in...');
    await page.waitForURL(`${BASE_URL}/borrower/dashboard`, { timeout: 10000 });
    await expect(page).toHaveURL(`${BASE_URL}/borrower/dashboard`);
  });

  test('harus berhasil login sebagai lender dan redirect ke dashboard lender', async ({ page }) => {
    await page.fill('input#email', loginCredentials.lender.email);
    await page.fill('input#password', loginCredentials.lender.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(`${BASE_URL}/lender/dashboard`, { timeout: 10000 });
    await expect(page).toHaveURL(`${BASE_URL}/lender/dashboard`);
  });

  test('harus berhasil login sebagai admin dan redirect ke dashboard admin', async ({ page }) => {
    await page.fill('input#email', loginCredentials.admin.email);
    await page.fill('input#password', loginCredentials.admin.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(`${BASE_URL}/admin/dashboard`, { timeout: 10000 });
    await expect(page).toHaveURL(`${BASE_URL}/admin/dashboard`);
  });

  test('harus menampilkan dialog kesalahan saat login gagal', async ({ page }) => {
    await page.fill('input#email', loginCredentials.invalid.email);
    await page.fill('input#password', loginCredentials.invalid.password);
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Login Failed')).toBeVisible();
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
    await page.click('button:has-text("Close")');
    await expect(page.locator('text=Login Failed')).not.toBeVisible();
  });

  test('harus memvalidasi input email dan kata sandi', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('input#email:invalid')).toBeVisible();
    await expect(page.locator('input#password:invalid')).toBeVisible();

    await page.fill('input#email', 'invalid-email');
    await page.fill('input#password', loginCredentials.borrower.password);
    await page.click('button[type="submit"]');

    await expect(page.locator('input#email:invalid')).toBeVisible();
  });
});