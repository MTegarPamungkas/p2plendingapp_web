import { test, expect, Page } from '@playwright/test';
import { APP_CONFIG, CREDENTIALS_CONFIG } from './config/credential';

// Helper function untuk login
async function performLogin(page: Page, role: string) {
    const roleKey = role.toUpperCase() as 'BORROWER' | 'LENDER' | 'ADMIN';
    const credentials = CREDENTIALS_CONFIG.LOGIN[roleKey];
    await page.goto(APP_CONFIG.ROUTES.LOGIN);
    await page.fill('input#email', credentials.email);
    await page.fill('input#password', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(APP_CONFIG.ROUTES[roleKey].DASHBOARD, { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
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

test.describe('E2E Lender Loan Funding', () => {
  test.beforeEach(async ({ page }) => {
    await setupErrorLogging(page);
    await performLogin(page, APP_CONFIG.ROLES.LENDER);

    // Navigate to Wallet and Deposit Funds
    await page.goto(APP_CONFIG.ROUTES.LENDER.WALLET);
    await expect(page.getByRole('heading', { name: APP_CONFIG.UI_TEXT.WALLET.TITLE })).toBeVisible();

    // Switch to Deposit tab
    await page.getByRole('tab', { name: 'Deposit' }).click();

    // Enter deposit amount
    const depositAmount = '1000000';
    await page.fill('input#amount', depositAmount);
    await expect(page.locator('input#amount')).toHaveValue(depositAmount);

    // Submit deposit
    await page.getByLabel('Deposit').getByRole('button', { name: APP_CONFIG.UI_TEXT.WALLET.DEPOSIT_BUTTON }).click();
  });

  test('should fund an approved loan', async ({ page }) => {
    // Step 1: Navigate to Loan Marketplace
    await page.goto(APP_CONFIG.ROUTES.LENDER.MARKETPLACE);
    await expect(page.getByRole('heading', { name: APP_CONFIG.UI_TEXT.MARKETPLACE.TITLE })).toBeVisible();

    // Step 2: Search for the approved loan
    await page.waitForSelector('div.bg-card', { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    const loanCard = page.locator('div.bg-card').filter({ hasText: 'expansion Loan' }).filter({ hasText: 'Rp 50.000.000' });
    await expect(loanCard.getByText('Rp 50.000.000', { exact: true })).toBeVisible();
    await expect(loanCard.getByText('5% p.a.')).toBeVisible();
    await expect(loanCard.getByText('3 months')).toBeVisible();

    // Step 3: View loan details
    await loanCard.getByText('View Opportunity').click();
    await page.waitForURL(`${APP_CONFIG.ROUTES.LENDER.MARKETPLACE}/*`, { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    await expect(page.getByRole('heading', { name: 'Expansion Loan' })).toBeVisible();
    await expect(page.getByText('5.00% p.a.')).toBeVisible();
    await expect(page.getByText('bulan').first()).toBeVisible();

    // Step 4: Enter investment amount
    const investmentInput = page.getByLabel('Jumlah Investasi');
    await investmentInput.fill('50000000');
    await expect(investmentInput).toHaveValue('50000000');

    // Step 5: Verify investment summary
    const summary = page.locator('.bg-muted\\/30');
    await expect(summary.getByText('Rp 50.000.000')).toBeVisible();
    await expect(summary.getByText('5.00%')).toBeVisible();
    const expectedReturn = 50000000 * 0.05 * 3;
    await expect(summary.getByText(`Rp ${Math.round(expectedReturn).toLocaleString('id-ID')}`)).toBeVisible();
    await expect(summary.getByText(`Rp ${(50000000 + Math.round(expectedReturn)).toLocaleString('id-ID')}`)).toBeVisible();

    // Step 6: Open investment dialog
    await page.getByRole('button', { name: APP_CONFIG.UI_TEXT.MARKETPLACE.INVEST_BUTTON }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Invest in expansion Loan' });

    // Step 7: Verify dialog content
    await expect(dialog.getByText('5.00% per month')).toBeVisible();
    await expect(dialog.getByText('3 months')).toBeVisible();
    await expect(dialog.getByText(`Rp ${Math.round(expectedReturn).toLocaleString('id-ID')}`)).toBeVisible();
    await expect(dialog.getByText(`Rp ${(50000000 + Math.round(expectedReturn)).toLocaleString('id-ID')}`)).toBeVisible();

    // Step 8: Select payment method
    const walletOption = dialog.locator('.flex.items-center.space-x-2').filter({ hasText: 'Balance' });
    await walletOption.getByRole('radio').check();
    await expect(walletOption.getByRole('radio')).toBeChecked();

    // Step 9: Submit investment
    await dialog.getByText('Invest Rp 50.000.000').click();

    // Step 10: Verify success
    await expect(page.getByText(APP_CONFIG.UI_TEXT.MARKETPLACE.SUCCESS_MESSAGE)).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    await expect(page.getByText('Terkonfirmasi')).toBeVisible();
  });
});