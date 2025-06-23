import { test, expect, Page } from '@playwright/test';
import { APP_CONFIG, CREDENTIALS_CONFIG, DUMMY_FILES } from './config/credential';

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

test.describe('E2E Pengajuan Pinjaman', () => {
  test.beforeEach(async ({ page }) => {
    await setupErrorLogging(page);
    await performLogin(page, APP_CONFIG.ROLES.BORROWER);
    await page.click(`text=Apply for a New Loan`);
    await page.waitForURL(APP_CONFIG.ROUTES.BORROWER.APPLY, { timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    await expect(page.getByRole('heading', { name: APP_CONFIG.UI_TEXT.LOAN_APPLICATION.TITLE })).toBeVisible();
    await expect(page.locator('#term')).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
  });

  test('UI elements should render correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: APP_CONFIG.UI_TEXT.LOAN_APPLICATION.TITLE })).toBeVisible();
    await expect(page.getByText(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.SUBTITLE)).toBeVisible();
    await expect(page.getByLabel(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.AMOUNT)).toBeVisible();
    await expect(page.getByLabel(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.INTEREST)).toBeVisible();
    await expect(page.getByText(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.TERM)).toBeVisible();
    await expect(page.getByText(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.PURPOSE)).toBeVisible();
    await expect(page.getByRole('button', { name: APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.NEXT })).toBeVisible();
  });

  test('should complete full loan application flow', async ({ page }) => {
    // Step 1: Loan Details
    await page.getByLabel(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.AMOUNT).fill('50000000');
    await page.getByLabel(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.INTEREST).fill('5');
    await page.getByLabel(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.TERM).click();
    await page.getByText('3 bulan').click();
    await page.getByLabel(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.PURPOSE).click();
    await page.getByText('Ekspansi Bisnis').click();
    await page.getByRole('button', { name: APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.NEXT }).click();

    // Step 2: Business Information
    await page.getByLabel(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.CASH_FLOW).fill('10000000');
    await page.getByLabel('Business').check();
    await page.getByLabel('Investments').check();
    await page.getByRole('button', { name: APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.NEXT }).click();

    // Step 3: Document Upload
    await page.getByLabel(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.DOC_COUNT).fill('1');
    await page.getByLabel(`${APP_CONFIG.UI_TEXT.LOAN_APPLICATION.FORM_LABELS.DOC_TYPE} 1`).fill('Laporan Keuangan');
    await page.locator('#file-upload-0').setInputFiles(DUMMY_FILES.IZIN_USAHA.path);
    await page.getByRole('button', { name: APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.SUMMARY }).click();

    // Step 4: Summary
    await expect(page.getByText(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.SUMMARY_TITLE)).toBeVisible();
    await expect(page.getByText('Rp 50.000.000')).toBeVisible();
    await expect(page.getByText('5% per tahun')).toBeVisible();
    await expect(page.getByText('3 bulan')).toBeVisible();
    await expect(page.getByText('Ekspansi Bisnis')).toBeVisible();
    await expect(page.getByText('Rp 10.000.000')).toBeVisible();
    await expect(page.getByText('Business, Investments')).toBeVisible();
    await expect(page.getByText(DUMMY_FILES.IZIN_USAHA.name)).toBeVisible();

    // Submit application
    await page.getByRole('button', { name: APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.SUBMIT }).click();

    // Step 5: Confirmation
    await expect(page.getByText(APP_CONFIG.UI_TEXT.LOAN_APPLICATION.SUCCESS_MESSAGE)).toBeVisible();
  });
});