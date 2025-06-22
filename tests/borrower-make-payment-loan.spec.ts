import { test, expect, Page } from '@playwright/test';
import { BASE_URL, loginCredentials, dummyFiles } from './config/credential';
import { formatCurrency } from '@/utils/utils';

test.describe('E2E Borrower Monthly Payment', () => {
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

    // Login as borrower
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input#email', loginCredentials.borrower.email);
    await page.fill('input#password', loginCredentials.borrower.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/borrower/dashboard`, { timeout: 10000 });

    // Step: Navigate to Wallet and Deposit Funds
    await page.goto(`${BASE_URL}/borrower/wallet`);
    await expect(page.getByRole('heading', { name: 'Wallet' })).toBeVisible();

    // Switch to Deposit tab
    await page.getByRole('tab', { name: 'Deposit' }).click();

    // Enter deposit amount (Rp 17,000,000 to cover the first installment)
    const depositAmount = '17000000';
    await page.fill('input#amount', depositAmount);
    await expect(page.locator('input#amount')).toHaveValue(depositAmount);


    // Submit deposit
    await page.getByLabel('Deposit').getByRole('button', { name: 'Deposit Funds' }).click();

  });

  test('should make a monthly loan payment', async ({ page }) => {
    // Step 1: Navigate to Borrower Loans
    await page.goto(`${BASE_URL}/borrower/loans`);
    await expect(page.getByRole('heading', { name: 'My Loans' })).toBeVisible();

    // Step 2: Find the Expansion Loan
    await page.waitForSelector('div.bg-card', { timeout: 10000 });
    const loanCard = page.locator('div.bg-card').filter({ hasText: 'Expansion' }).filter({ hasText: 'Rp 50.000.000' });
    await expect(loanCard.getByText('Rp 50.000.000')).toBeVisible();
    await expect(loanCard.getByText('5.0% p.a.')).toBeVisible();
    await expect(loanCard.getByText('3 months')).toBeVisible();
    await expect(loanCard.getByText('ACTIVE')).toBeVisible();

    // Step 3: View loan details
    await loanCard.getByText('View Details').click();
    await page.waitForURL(`${BASE_URL}/borrower/loans/*`, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Expansion Loan' })).toBeVisible();
    await expect(page.getByText('Target:Rp 50.000.000')).toBeVisible();
    await expect(page.getByText('5% p.a.')).toBeVisible();
    await expect(page.getByText('3 months')).toBeVisible();

    // Step 4: Verify repayment schedule
    await page.getByRole('tab', { name: 'Repayment Schedule' }).click();
    const firstInstallment = page.locator('.flex.items-center.justify-between').filter({ hasText: 'Payment #1' });
    await expect(firstInstallment.getByText('Pending')).toBeVisible();

    // Step 5: Open payment dialog
    await page.getByRole('button', { name: 'Make Payment' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Make a Payment' });

    // Step 6: Select payment method (wallet)
    const walletOption = dialog.locator('.flex.items-center.space-x-2').filter({ hasText: 'Balance' });
    await walletOption.getByRole('radio').check();
    await expect(walletOption.getByRole('radio')).toBeChecked();

    // Step 7: Submit payment
    await dialog.getByRole('button', { name: 'Make Payment' }).click();

    // Step 8: Verify success
    

    // Step 9: Verify repayment schedule update
    await page.goto(`${BASE_URL}/borrower/loans`);
    await loanCard.getByText('View Details').click();
    await page.waitForURL(`${BASE_URL}/borrower/loans/*`, { timeout: 10000 });
    await page.getByRole('tab', { name: 'Repayment Schedule' }).click();
    await expect(firstInstallment.getByText('Paid').nth(3)).toBeVisible();

    // Optional Step 10: Verify lender's wallet for payment distribution
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input#email', loginCredentials.lender.email);
    await page.fill('input#password', loginCredentials.lender.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/lender/dashboard`, { timeout: 10000 });

    await page.goto(`${BASE_URL}/lender/wallet`);
    const transaction = page.locator('.flex.items-center').filter({ hasText: 'PAYMENT_DISTRIBUTION' });
    await expect(transaction.getByText('+Rp 18.783.333')).toBeVisible(); // Interest portion distributed to lender
    await expect(transaction.getByText('Loan ID:')).toBeVisible();
  });

 
});