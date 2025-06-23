import { test, expect, Page } from '@playwright/test';
import { APP_CONFIG, CREDENTIALS_CONFIG, DUMMY_FILES } from './config/credential';

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
  page.on('requestfailed', request => console.log(`Request failed: ${request.url()}`));
}

// Helper function untuk registrasi step 1
async function fillPersonalInfo(page: Page, credentials: any, role: string) {
  await page.locator(`label[for="${role}"]`).click();
  await page.fill('input#username', credentials.username);
  await page.fill('input#fullName', credentials.fullName);
  await page.fill('input#email', credentials.email);
  await page.fill('input#phoneNumber', credentials.phoneNumber);
  await page.fill('input#address', credentials.address);
  await page.fill('input#dateOfBirth', credentials.dateOfBirth);
  await page.fill('input#idNumber', credentials.idNumber);

  console.log('Uploading KTP file...');
  await page.setInputFiles('input#ktp', DUMMY_FILES.KTP.path);
  await expect(page.locator(`text=File: ${DUMMY_FILES.KTP.name}`)).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.FILE_UPLOAD });

  await page.waitForTimeout(APP_CONFIG.TIMEOUTS.FILTER);

  console.log('Uploading Swafoto file...');
  await page.setInputFiles('input#swafoto', DUMMY_FILES.SWAFOTO.path);
  await expect(page.locator(`text=File: ${DUMMY_FILES.SWAFOTO.name}`)).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.FILE_UPLOAD });

  await page.click(`button:has-text("${APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.NEXT}")`);
}

// Helper function untuk registrasi step 2
async function fillBankInfo(page: Page, credentials: any) {
  await page.fill('input#bankAccount', credentials.bankAccount);
  await page.fill('input#bankName', credentials.bankName);
  await page.click(`button:has-text("${APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.NEXT}")`);
}

test.describe('E2E Halaman Registrasi P2P Lending', () => {
  test.beforeEach(async ({ page }) => {
    await setupErrorLogging(page);
    await page.goto(APP_CONFIG.ROUTES.REGISTER);
  });

  test('harus berhasil registrasi sebagai borrower dan menampilkan halaman sukses', async ({ page }) => {
    await fillPersonalInfo(page, CREDENTIALS_CONFIG.REGISTER.BORROWER, APP_CONFIG.ROLES.BORROWER);
    await fillBankInfo(page, CREDENTIALS_CONFIG.REGISTER.BORROWER);

    // Step 3: Info Usaha
    await page.fill('input#businessName', CREDENTIALS_CONFIG.REGISTER.BORROWER.businessName);
    await page.fill('input#businessDuration', CREDENTIALS_CONFIG.REGISTER.BORROWER.businessDuration);
    const selectTrigger = page.locator('#businessType');
    await selectTrigger.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    console.log('Uploading Izin Usaha file...');
    await page.setInputFiles('input#izin_usaha', DUMMY_FILES.IZIN_USAHA.path);
    await expect(page.locator(`text=File: ${DUMMY_FILES.IZIN_USAHA.name}`)).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.FILE_UPLOAD });

    await page.click(`button:has-text("${APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.NEXT}")`);

    // Step 4: Keamanan
    await page.fill('input#password', CREDENTIALS_CONFIG.REGISTER.BORROWER.password);
    await page.fill('input#confirmPassword', CREDENTIALS_CONFIG.REGISTER.BORROWER.password);
    await page.click('button:has-text("Daftar")');

    // Cek halaman sukses
    await expect(page.locator(`text=${APP_CONFIG.UI_TEXT.REGISTER.SUCCESS_TITLE}`)).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    await expect(page.locator(`text=${APP_CONFIG.UI_TEXT.REGISTER.SUCCESS_MESSAGE}`)).toBeVisible();
    await expect(page.getByRole('link', { name: APP_CONFIG.UI_TEXT.REGISTER.LOGIN_LINK })).toBeVisible();
  });

  test('harus berhasil registrasi sebagai lender dan menampilkan halaman sukses', async ({ page }) => {
    await fillPersonalInfo(page, CREDENTIALS_CONFIG.REGISTER.LENDER, APP_CONFIG.ROLES.LENDER);
    await fillBankInfo(page, CREDENTIALS_CONFIG.REGISTER.LENDER);

    // Step 3: Keamanan (skip business info)
    await page.fill('input#password', CREDENTIALS_CONFIG.REGISTER.LENDER.password);
    await page.fill('input#confirmPassword', CREDENTIALS_CONFIG.REGISTER.LENDER.password);
    await page.click('button:has-text("Daftar")');

    // Cek halaman sukses
    await expect(page.locator(`text=${APP_CONFIG.UI_TEXT.REGISTER.SUCCESS_TITLE}`)).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.PAGE_LOAD });
    await expect(page.locator(`text=${APP_CONFIG.UI_TEXT.REGISTER.SUCCESS_MESSAGE}`)).toBeVisible();
    await expect(page.getByRole('link', { name: APP_CONFIG.UI_TEXT.REGISTER.LOGIN_LINK })).toBeVisible();
  });

  test('harus menampilkan error validasi untuk input tidak valid di Step 1', async ({ page }) => {
    await page.locator(`label[for="${APP_CONFIG.ROLES.BORROWER}"]`).click();
    await page.click(`button:has-text("${APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.NEXT}")`);

    await expect(page.locator(`text=Username ${APP_CONFIG.VALIDATION_MESSAGES.REQUIRED}`)).toBeVisible();
    await expect(page.locator(`text=Nama lengkap ${APP_CONFIG.VALIDATION_MESSAGES.REQUIRED}`)).toBeVisible();
    await expect(page.locator(`text=${APP_CONFIG.VALIDATION_MESSAGES.EMAIL}`)).toBeVisible();
    await expect(page.locator(`text=Nomor telepon ${APP_CONFIG.VALIDATION_MESSAGES.REQUIRED}`)).toBeVisible();
    await expect(page.locator(`text=Alamat ${APP_CONFIG.VALIDATION_MESSAGES.REQUIRED}`)).toBeVisible();
    await expect(page.locator(`text=Tanggal lahir ${APP_CONFIG.VALIDATION_MESSAGES.REQUIRED}`)).toBeVisible();
    await expect(page.locator(`text=${APP_CONFIG.VALIDATION_MESSAGES.KTP}`)).toBeVisible();
    await expect(page.locator(`text=Dokumen KTP ${APP_CONFIG.VALIDATION_MESSAGES.REQUIRED2}`)).toBeVisible();
    await expect(page.locator(`text=Swafoto dengan KTP ${APP_CONFIG.VALIDATION_MESSAGES.REQUIRED2}`)).toBeVisible();

    await page.fill('input#email', CREDENTIALS_CONFIG.REGISTER.INVALID.email);
    await page.fill('input#idNumber', CREDENTIALS_CONFIG.REGISTER.INVALID.idNumber);
    await page.click(`button:has-text("${APP_CONFIG.UI_TEXT.LOAN_APPLICATION.BUTTONS.NEXT}")`);

    await expect(page.locator(`text=${APP_CONFIG.VALIDATION_MESSAGES.EMAIL}`)).toBeVisible();
    await expect(page.locator(`text=${APP_CONFIG.VALIDATION_MESSAGES.KTP}`)).toBeVisible();
  });

  test('harus menampilkan error saat upload file invalid di Step 1', async ({ page }) => {
    let dialogMessage = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      console.log('Dialog detected:', dialogMessage);
      await dialog.accept();
    });

    await page.locator(`label[for="${APP_CONFIG.ROLES.BORROWER}"]`).click();

    const invalidFile = {
      name: 'invalid.doc',
      mimeType: 'application/msword',
      buffer: Buffer.alloc(1024),
    };

    console.log('Attempting to upload invalid file...');
    await page.setInputFiles('input#ktp', invalidFile);
    await page.waitForTimeout(APP_CONFIG.TIMEOUTS.FILTER);
    expect(dialogMessage).toBe(APP_CONFIG.VALIDATION_MESSAGES.FILE_TYPE);
  });

  test('harus menampilkan error saat upload file terlalu besar', async ({ page }) => {
    let dialogMessage = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      console.log('Dialog detected:', dialogMessage);
      await dialog.accept();
    });

    await page.locator(`label[for="${APP_CONFIG.ROLES.BORROWER}"]`).click();

    const largeFile = {
      name: 'large.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.alloc(6 * 1024 * 1024),
    };

    console.log('Uploading large file...');
    await page.setInputFiles('input#ktp', largeFile);
    await page.waitForTimeout(APP_CONFIG.TIMEOUTS.FILTER);
    expect(dialogMessage).toBe(APP_CONFIG.VALIDATION_MESSAGES.FILE_SIZE);
  });
});