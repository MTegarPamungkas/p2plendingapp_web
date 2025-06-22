import { test, expect, Page } from '@playwright/test';
import { BASE_URL, loginCredentials, dummyFiles } from './config/credential';

test.describe('E2E Lender Loan Funding', () => {
  test.beforeEach(async ({ page }) => {
    // Log console and page errors for debugging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Browser console error: ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => {
      console.log(`Page error: ${err.message}`);
    });

    // Login as lender
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input#email', loginCredentials.lender.email);
    await page.fill('input#password', loginCredentials.lender.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/lender/dashboard`, { timeout: 10000 });

    // Step: Navigate to Wallet and Deposit Funds
    await page.goto(`${BASE_URL}/lender/wallet`);
    await expect(page.getByRole('heading', { name: 'Wallet' })).toBeVisible();

    // Switch to Deposit tab
    await page.getByRole('tab', { name: 'Deposit' }).click();

    // Enter deposit amount (e.g., Rp 1,000,000 to ensure sufficient balance)
    const depositAmount = '1000000';
    await page.fill('input#amount', depositAmount);
    await expect(page.locator('input#amount')).toHaveValue(depositAmount);

    // // Select payment method (assuming one is available)
    // const paymentMethod = page.locator('.flex.items-center.space-x-2').filter({ hasText: loginCredentials.lender. });
    // await paymentMethod.getByRole('radio').check();
    // await expect(paymentMethod.getByRole('radio')).toBeChecked();

    // Submit deposit
    await page.getByLabel('Deposit').getByRole('button', { name: 'Deposit Funds' }).click();

  });

  test('should fund an approved loan', async ({ page }) => {
    // Step 1: Navigate to Loan Marketplace
    await page.goto(`${BASE_URL}/lender/marketplace`);
    await expect(page.getByRole('heading', { name: 'Loan Marketplace' })).toBeVisible();

    // Step 2: Search for the approved loan (e.g., by purpose)
    await page.waitForSelector('div.bg-card', { timeout: 10000 });
    const loanCard = page.locator('div.bg-card').filter({ hasText: 'expansion Loan' }).filter({ hasText: 'Rp 50.000.000' });
    await expect(loanCard.getByText('Rp 50.000.000', { exact: true })).toBeVisible();
    await expect(loanCard.getByText('5% p.a.')).toBeVisible();
    await expect(loanCard.getByText('3 months')).toBeVisible();

    // Step 3: View loan details
    await loanCard.getByText('View Opportunity').click();
    await page.waitForURL(`${BASE_URL}/lender/marketplace/*`, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Expansion Loan' })).toBeVisible();
    await expect(page.getByText('Target:Rp 50.000.000')).toBeVisible();
    await expect(page.getByText('5.00% p.a.')).toBeVisible();
    await expect(page.getByText('bulan').first()).toBeVisible();

    // Step 4: Enter investment amount
    const investmentInput = page.getByLabel('Jumlah Investasi');
    await investmentInput.fill('500000');
    await expect(investmentInput).toHaveValue('500000');

    // Step 5: Verify investment summary
    const summary = page.locator('.bg-muted\\/30');
    await expect(summary.getByText('Rp 500.000')).toBeVisible();
    await expect(summary.getByText('5.00%')).toBeVisible();
    const expectedReturn = 500000 * 0.05 * 3; // Example: Rp 500,000 * 5% * 3 months
    await expect(summary.getByText(`Rp ${Math.round(expectedReturn).toLocaleString('id-ID')}`)).toBeVisible();
    await expect(summary.getByText(`Rp ${(500000 + Math.round(expectedReturn)).toLocaleString('id-ID')}`)).toBeVisible();

    // Step 6: Open investment dialog
    await page.getByRole('button', { name: 'Investasi Sekarang' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Invest in expansion Loan' });

    // Step 7: Verify dialog content
    await expect(dialog.getByText('Rp 500.000', { exact: true })).toBeVisible();
    await expect(dialog.getByText('5.00% per month')).toBeVisible();
    await expect(dialog.getByText('3 months')).toBeVisible();
    await expect(dialog.getByText(`Rp ${Math.round(expectedReturn).toLocaleString('id-ID')}`)).toBeVisible();
    await expect(dialog.getByText(`Rp ${(500000 + Math.round(expectedReturn)).toLocaleString('id-ID')}`)).toBeVisible();

    // Step 8: Select payment method (assumes one wallet is available)
    const walletOption = dialog.locator('.flex.items-center.space-x-2').filter({ hasText: 'Balance' });
    await walletOption.getByRole('radio').check();
    await expect(walletOption.getByRole('radio')).toBeChecked();

    // Step 9: Submit investment
    await dialog.getByText('Invest Rp 500.000').click();

    // Step 10: Verify success
    await expect(page.getByText('Investasi Berhasil!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Rp 500.000')).toBeVisible();
    await expect(page.getByText('Terkonfirmasi')).toBeVisible();

    // Step 11: Verify investment reflected in marketplace
    await page.goto(`${BASE_URL}/lender/marketplace`);
    await page.waitForSelector('div.bg-card', { timeout: 10000 });
    const updatedLoanCard = page.locator('div.bg-card').filter({ hasText: 'expansion Loan' }).filter({ hasText: 'Rp 50.000.000' });
    
  });

});