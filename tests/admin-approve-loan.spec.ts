import { test, expect, Page } from '@playwright/test';
import { BASE_URL, loginCredentials, dummyFiles } from './config/credential';

test.describe('E2E Admin Loan Approval', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Browser console error: ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => {
      console.log(`Page error: ${err.message}`);
    });

    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input#email', loginCredentials.admin.email);
    await page.fill('input#password', loginCredentials.admin.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin/dashboard`, { timeout: 10000 });
  });

  test('should approve a pending loan application', async ({ page }) => {
    // Step 1: Navigate to Applications Management page
    await page.goto(`${BASE_URL}/admin/applications`);
    await expect(page.getByText('Applications Management')).toBeVisible();

    // Step 2: Search for the loan application (e.g., by purpose or amount)
    await page.fill('input[placeholder="Search applications..."]', 'expansion');
    await page.waitForTimeout(1000); // Allow time for filtering

    // Step 3: Verify the loan appears in the table
    const loanRow = page.locator('tr').filter({ hasText: 'expansion' }).filter({ hasText: 'Rp 50.000.000' });
    await expect(loanRow).toBeVisible();
    await expect(loanRow.getByText('PENDING_APPROVAL')).toBeVisible();
    await expect(loanRow.getByText('Rp 50.000.000')).toBeVisible();

    // Step 4: Open the actions dropdown and view details
    await loanRow.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('menuitem', { name: 'View Details' }).click();

    // Step 5: Verify Loan Details page
    await page.waitForURL(`${BASE_URL}/admin/applications/*`, { timeout: 10000 });
    await expect(page.getByText('expansion Loan' )).toBeVisible();
    await expect(page.getByText('PENDING_APPROVAL')).toBeVisible();
    await expect(page.getByText('Rp 50.000.000', { exact: true })).toBeVisible();
    await expect(page.getByText('5% p.a.')).toBeVisible();
    await expect(page.getByText('3 months')).toBeVisible();

    // Step 6: Approve the loan
    await page.getByRole('button', { name: 'Approve Loan' }).click();
    await expect(page.getByRole('heading', { name: 'Approve Loan' })).toBeVisible();
    await page.getByRole('button', { name: 'Setujui Pinjaman' }).click();

    // Step 7: Verify approval success
    await expect(page.getByText('This loan was approved for')).toBeVisible({ timeout: 10000 });
    await page.goto(`${BASE_URL}/admin/applications`);
    await page.fill('input[placeholder="Search applications..."]', 'Expansion');
    await expect(page.locator('tr').filter({ hasText: 'Expansion' }).filter({hasText: 'Rp 50.000.000'}).getByText('APPROVED')).toBeVisible();
  });
});