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

test.describe('E2E Admin Loan Approval', () => {
  test.beforeEach(async ({ page }) => {
    await setupErrorLogging(page);
    await performLogin(page, APP_CONFIG.ROLES.ADMIN);
  });

  test('should approve a pending loan application', async ({ page }) => {
    // Step 1: Navigate to Applications Management page
    await page.goto(APP_CONFIG.ROUTES.ADMIN.APPLICATIONS);
    await expect(page.getByText(APP_CONFIG.UI_TEXT.ADMIN.APPLICATIONS_TITLE)).toBeVisible();

    // Step 2: Search for the loan application
    await page.fill('input[placeholder="Search applications..."]', 'expansion');
    await page.waitForTimeout(APP_CONFIG.TIMEOUTS.FILTER);

    // Step 3: Verify the loan appears in the table
    const loanRow = page.locator('tr').filter({ hasText: 'expansion' }).filter({ hasText: 'Rp 50.000.000' }).filter({ hasText: 'PENDING_APPROVAL' });
    await expect(loanRow).toBeVisible();
    await expect(loanRow.getByText('PENDING_APPROVAL')).toBeVisible();
    await expect(loanRow.getByText('Rp 50.000.000')).toBeVisible();

    // Step 4: Open the actions dropdown and view details
    await loanRow.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('menuitem', { name: 'View Details' }).click();

    // Step 5: Verify Loan Details page
    await page.waitForURL(`${APP_CONFIG.ROUTES.ADMIN.APPLICATIONS}/*`, { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    await expect(page.getByText('expansion Loan')).toBeVisible();
    await expect(page.getByText('PENDING_APPROVAL')).toBeVisible();
    await expect(page.getByText('Rp 50.000.000', { exact: true })).toBeVisible();
    await expect(page.getByText('5% p.a.')).toBeVisible();
    await expect(page.getByText('3 months')).toBeVisible();

    // Step 6: Approve the loan
    await page.getByRole('button', { name: 'Approve Loan' }).click();
    await expect(page.getByRole('heading', { name: APP_CONFIG.UI_TEXT.ADMIN.APPROVE_TITLE })).toBeVisible();
    await page.getByRole('button', { name: APP_CONFIG.UI_TEXT.ADMIN.APPROVE_BUTTON }).click();

    // Step 7: Verify approval success
    await expect(page.getByText('This loan was approved for')).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    await page.goto(APP_CONFIG.ROUTES.ADMIN.APPLICATIONS);
    await page.fill('input[placeholder="Search applications..."]', 'Expansion');
    await expect(page.locator('tr').filter({ hasText: 'expansion' }).filter({ hasText: 'Rp 50.000.000' }).getByText('APPROVED').first()).toBeVisible();
  });
});