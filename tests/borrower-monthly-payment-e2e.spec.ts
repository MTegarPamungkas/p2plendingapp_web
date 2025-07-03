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

// Helper function untuk make payment
async function makePayment(page: Page, paymentNumber: number) {
  console.log(`Making payment #${paymentNumber}`);
  
  // Open payment dialog
  await page.getByRole('button', { name: 'Make Payment' }).click();
  const dialog = page.getByRole('dialog').filter({ hasText: 'Make a Payment' });

  // Select payment method (wallet)
  const walletOption = dialog.locator('.flex.items-center.space-x-2').filter({ hasText: 'Balance' });
  await walletOption.getByRole('radio').check();
  await expect(walletOption.getByRole('radio')).toBeChecked();

  // Submit payment
  await dialog.getByRole('button', { name: 'Make Payment' }).click();
  
  // Wait for dialog to close
  await expect(dialog).not.toBeVisible();
  
  // Wait a bit for the payment to process
  await page.waitForTimeout(2000);
}

test.describe('E2E Borrower Monthly Payment - All Installments', () => {
  test.beforeEach(async ({ page }) => {
    await setupErrorLogging(page);
    await performLogin(page, APP_CONFIG.ROLES.BORROWER);

  });

  test('should make all 3 monthly loan payments', async ({ page }) => {
    // Step 1: Navigate to Borrower Loans
    await page.goto(APP_CONFIG.ROUTES.BORROWER.LOANS);
    await expect(page.getByRole('heading', { name: APP_CONFIG.UI_TEXT.LOANS.TITLE })).toBeVisible();

    // Step 2: Find the Expansion Loan
    await page.waitForSelector('div.bg-card', { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    const loanCard = page.locator('div.bg-card').filter({ hasText: 'Expansion' }).filter({ hasText: 'Rp 50.000.000' }).filter({ hasText: 'ACTIVE' });
    await expect(loanCard.getByText('Rp 50.000.000')).toBeVisible();
    await expect(loanCard.getByText('5.0% p.a.')).toBeVisible();
    await expect(loanCard.getByText('3 months')).toBeVisible();
    await expect(loanCard.getByText('ACTIVE')).toBeVisible();

    // Step 3: View loan details
    await loanCard.getByText('View Details').click();
    await page.waitForURL(`${APP_CONFIG.ROUTES.BORROWER.LOANS}/*`, { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    await expect(page.getByRole('heading', { name: 'Expansion Loan' })).toBeVisible();
    await expect(page.getByText('Target:Rp 50.000.000')).toBeVisible();
    await expect(page.getByText('5% p.a.')).toBeVisible();
    await expect(page.getByText('3 months')).toBeVisible();

    // Step 4: Go to Repayment Schedule tab
    await page.getByRole('tab', { name: 'Repayment Schedule' }).click();

    // Step 5: Verify all installments are initially pending
    const firstInstallment = page.locator('.flex.items-center.justify-between').filter({ hasText: 'Payment #1' });
    const secondInstallment = page.locator('.flex.items-center.justify-between').filter({ hasText: 'Payment #2' });
    const thirdInstallment = page.locator('.flex.items-center.justify-between').filter({ hasText: 'Payment #3' });
    
    await expect(firstInstallment.getByText('Pending')).toBeVisible();
    await expect(secondInstallment.getByText('Pending')).toBeVisible();
    await expect(thirdInstallment.getByText('Pending')).toBeVisible();

    // Step 6: Make Payment #1
    await makePayment(page, 1);
    
    // Verify Payment #1 is now paid
    await expect(firstInstallment.getByText('Paid', { exact: true })).toBeVisible();
    console.log('Payment #1 completed successfully');

    // Step 7: Make Payment #2
    await makePayment(page, 2);
    
    // Verify Payment #2 is now paid
    await expect(secondInstallment.getByText('Paid', { exact: true })).toBeVisible();
    console.log('Payment #2 completed successfully');

    // Step 8: Make Payment #3 (final payment)
    await makePayment(page, 3);
    
    // Verify Payment #3 is now paid
    await expect(thirdInstallment.getByText('Paid', { exact: true })).toBeVisible();
    console.log('Payment #3 completed successfully');

    // Step 9: Verify all payments are completed
    await expect(firstInstallment.getByText('Paid', { exact: true })).toBeVisible();
    await expect(secondInstallment.getByText('Paid', { exact: true })).toBeVisible();
    await expect(thirdInstallment.getByText('Paid', { exact: true })).toBeVisible();
    
    console.log('All 3 monthly payments completed successfully!');

    // Step 10: Check loan status (should be COMPLETED or PAID)
    await page.goto(APP_CONFIG.ROUTES.BORROWER.LOANS);
    await page.waitForSelector('div.bg-card', { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    
    // The loan status should now be updated to completed
    const completedLoanCard = page.locator('div.bg-card').filter({ hasText: 'Expansion' }).filter({ hasText: 'Rp 50.000.000' }).first();
    // Status might be 'COMPLETED', 'PAID', or 'CLOSED' depending on your app logic
    await expect(completedLoanCard.getByText(/COMPLETED|PAID|CLOSED/)).toBeVisible();

    // Step 11: Verify lender's wallet for all payment distributions
    await performLogin(page, APP_CONFIG.ROLES.LENDER);
    await page.goto(APP_CONFIG.ROUTES.LENDER.WALLET);
    
    // Check for all distribution transactions
    const distributionTransactions = page.locator('.flex.items-center').filter({ hasText: 'Distribution from loan repayment' });
    
    // Verify each of the 3 latest distribution amounts
    const expectedAmount = '+Rp 18.783.333';    
    
    // Alternative approach - langsung cek 3 transaksi pertama
    await expect(distributionTransactions.nth(0).getByText(expectedAmount)).toBeVisible();
    await expect(distributionTransactions.nth(2).getByText(expectedAmount)).toBeVisible();
    await expect(distributionTransactions.nth(4).getByText(expectedAmount)).toBeVisible();
    
    console.log('All 3 latest lender distributions verified successfully!');
});
});