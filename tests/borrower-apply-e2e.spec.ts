import { test, expect, Page } from '@playwright/test';
import { BASE_URL, loginCredentials, dummyFiles } from './config/credential';

test.describe('E2E Pengajuan Pinjaman', () => {
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

    // Navigate to loan application page
    await page.click('text=Apply for a New Loan');
    await page.waitForURL(`${BASE_URL}/borrower/apply`, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Ajukan Pinjaman' })).toBeVisible();
    await expect(page.locator('#term')).toBeVisible({ timeout: 10000 }); // Ensure Term Select is rendered
  });


  test('UI elements should render correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ajukan Pinjaman' })).toBeVisible();
    await expect(page.getByText('Lengkapi formulir aplikasi')).toBeVisible();

    await expect(page.getByLabel('Jumlah Pinjaman')).toBeVisible();
    await expect(page.getByLabel('Suku Bunga (%)')).toBeVisible();
    await expect(page.getByText('Jangka Waktu Pinjaman')).toBeVisible();
    await expect(page.getByText('Tujuan Pinjaman')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Langkah Berikutnya' })).toBeVisible();
  });

  test('should complete full loan application flow', async ({ page }) => {
    // Step 1: Loan Details
    await page.getByLabel('Jumlah Pinjaman').fill('50000000');
    await page.getByLabel('Suku Bunga (%)').fill('5');

    await page.getByLabel('Jangka Waktu Pinjaman').click();
    await page.getByText('3 bulan').click();

    await page.getByLabel('Tujuan Pinjaman').click();
    await page.getByText('Ekspansi Bisnis').click();

    await page.getByRole('button', { name: 'Langkah Berikutnya' }).click();

    // Step 2: Business Information
    await page.getByLabel('Arus Kas Bulanan').fill('10000000');
    await page.getByLabel('Business').check();
    await page.getByLabel('Investments').check();
    await page.getByRole('button', { name: 'Langkah Berikutnya' }).click();

    // Step 3: Document Upload
    await page.getByLabel('Jumlah Dokumen').fill('1');

    // First document
    await page.getByLabel('Jenis Dokumen 1').fill('Laporan Keuangan');
    await page.locator('#file-upload-0').setInputFiles(dummyFiles.izin_usaha.path);


    // // Second document
    // await page.getByLabel('Jenis Dokumen 2').fill('KTP');
    // await page.locator('#file-upload-1').setInputFiles(dummyFiles.izin_usaha.path);

    await page.getByRole('button', { name: 'Lihat Ringkasan' }).click();

    // Step 4: Summary
    await expect(page.getByText('Ringkasan Aplikasi Pinjaman')).toBeVisible();
    await expect(page.getByText('Rp 50.000.000')).toBeVisible();
    await expect(page.getByText('5% per tahun')).toBeVisible();
    await expect(page.getByText('3 bulan')).toBeVisible();
    await expect(page.getByText('Ekspansi Bisnis')).toBeVisible();
    await expect(page.getByText('Rp 10.000.000')).toBeVisible();
    await expect(page.getByText('Business, Investments')).toBeVisible();
    await expect(page.getByText('izin_usaha.pdf')).toBeVisible();

    // Submit application
    await page.getByRole('button', { name: 'Konfirmasi dan Kirim' }).click();

    // Step 5: Confirmation
    await expect(page.getByText('Aplikasi Terkirim!')).toBeVisible();
  });

  
});