import { test, expect } from '@playwright/test';
import { BASE_URL, registerCredentials, dummyFiles } from './config/credential';

test.describe('E2E Halaman Registrasi P2P Lending', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    // Tambah log untuk debug
    page.on('requestfailed', request => console.log(`Request failed: ${request.url()}`));
  });

  test('harus berhasil registrasi sebagai borrower dan menampilkan halaman sukses', async ({ page }) => {
    // Step 1: Info Pribadi
    await page.locator('label[for="borrower"]').click();
    await page.fill('input#username', registerCredentials.borrower.username);
    await page.fill('input#fullName', registerCredentials.borrower.fullName);
    await page.fill('input#email', registerCredentials.borrower.email);
    await page.fill('input#phoneNumber', registerCredentials.borrower.phoneNumber);
    await page.fill('input#address', registerCredentials.borrower.address);
    await page.fill('input#dateOfBirth', registerCredentials.borrower.dateOfBirth);
    await page.fill('input#idNumber', registerCredentials.borrower.idNumber);
    
    // Upload KTP - Improved approach
    console.log('Uploading KTP file...');
    await page.setInputFiles('input#ktp', dummyFiles.ktp.path);
    await expect(page.locator('text=File: ktp.jpg')).toBeVisible({ timeout: 10000 });
    
    // Wait for component to re-render after first file upload
    await page.waitForTimeout(1000);
    
    // Upload Swafoto - More robust selector
    console.log('Uploading Swafoto file...');
    await page.setInputFiles('input#swafoto', dummyFiles.swafoto.path);
    await expect(page.locator('text=File: swafoto.jpg')).toBeVisible({ timeout: 10000 });
    
    await page.click('button:has-text("Langkah Berikutnya")');

    // Step 2: Info Bank
    await page.fill('input#bankAccount', registerCredentials.borrower.bankAccount);
    await page.fill('input#bankName', registerCredentials.borrower.bankName);
    await page.click('button:has-text("Langkah Berikutnya")');

    // Step 3: Info Usaha
    await page.fill('input#businessName', registerCredentials.borrower.businessName);
    await page.fill('input#businessDuration', registerCredentials.borrower.businessDuration);
    const selectTrigger = page.locator('#businessType');
    await selectTrigger.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // Upload Izin Usaha
    console.log('Uploading Izin Usaha file...');
    await page.setInputFiles('input#izin_usaha', dummyFiles.izin_usaha.path);
    await expect(page.locator('text=File: izin_usaha.pdf')).toBeVisible({ timeout: 10000 });
    
    await page.click('button:has-text("Langkah Berikutnya")');

    // Step 4: Keamanan
    await page.fill('input#password', registerCredentials.borrower.password);
    await page.fill('input#confirmPassword', registerCredentials.borrower.password);
    
    await page.click('button:has-text("Daftar")');


    // Cek halaman sukses
    await expect(page.locator('text=Pendaftaran Berhasil!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Akun Anda telah berhasil dibuat')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Masuk ke Akun' })).toBeVisible();
  });

  test('harus berhasil registrasi sebagai lender dan menampilkan halaman sukses', async ({ page }) => {
    // Step 1: Info Pribadi
    await page.locator('label[for="lender"]').click();
    await page.fill('input#username', registerCredentials.lender.username);
    await page.fill('input#fullName', registerCredentials.lender.fullName);
    await page.fill('input#email', registerCredentials.lender.email);
    await page.fill('input#phoneNumber', registerCredentials.lender.phoneNumber);
    await page.fill('input#address', registerCredentials.lender.address);
    await page.fill('input#dateOfBirth', registerCredentials.lender.dateOfBirth);
    await page.fill('input#idNumber', registerCredentials.lender.idNumber);
    
    // Upload KTP
    console.log('Uploading KTP file...');
    await page.setInputFiles('input#ktp', dummyFiles.ktp.path);
    await expect(page.locator('text=File: ktp.jpg')).toBeVisible({ timeout: 10000 });
    
    // Wait for component re-render
    await page.waitForTimeout(1000);
    
    // Upload Swafoto
    console.log('Uploading Swafoto file...');
    await page.setInputFiles('input#swafoto', dummyFiles.swafoto.path);
    await expect(page.locator('text=File: swafoto.jpg')).toBeVisible({ timeout: 10000 });
    
    await page.click('button:has-text("Langkah Berikutnya")');

    // Step 2: Info Bank
    await page.fill('input#bankAccount', registerCredentials.lender.bankAccount);
    await page.fill('input#bankName', registerCredentials.lender.bankName);
    await page.click('button:has-text("Langkah Berikutnya")');

    // Step 4: Keamanan (skip Step 3)
    await page.fill('input#password', registerCredentials.lender.password);
    await page.fill('input#confirmPassword', registerCredentials.lender.password);
    
    await page.click('button:has-text("Daftar")');

    // Cek halaman sukses
    await expect(page.locator('text=Pendaftaran Berhasil!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Akun Anda telah berhasil dibuat')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Masuk ke Akun' })).toBeVisible();
  });

  test('harus menampilkan error validasi untuk input tidak valid di Step 1', async ({ page }) => {
    // Step 1: Submit tanpa isi
    await page.locator('label[for="borrower"]').click();
    await page.click('button:has-text("Langkah Berikutnya")');

    // Cek error
    await expect(page.locator('text=Username wajib diisi')).toBeVisible();
    await expect(page.locator('text=Nama lengkap wajib diisi')).toBeVisible();
    await expect(page.locator('text=Email valid wajib diisi')).toBeVisible();
    await expect(page.locator('text=Nomor telepon wajib diisi')).toBeVisible();
    await expect(page.locator('text=Alamat wajib diisi')).toBeVisible();
    await expect(page.locator('text=Tanggal lahir wajib diisi')).toBeVisible();
    await expect(page.locator('text=Nomor KTP harus 16 digit')).toBeVisible();
    await expect(page.locator('text=Dokumen KTP wajib diunggah')).toBeVisible();
    await expect(page.locator('text=Swafoto dengan KTP wajib diunggah')).toBeVisible();

    // Isi input tidak valid
    await page.fill('input#email', registerCredentials.invalid.email);
    await page.fill('input#idNumber', registerCredentials.invalid.idNumber);
    await page.click('button:has-text("Langkah Berikutnya")');

    // Cek error spesifik
    await expect(page.locator('text=Email valid wajib diisi')).toBeVisible();
    await expect(page.locator('text=Nomor KTP harus 16 digit')).toBeVisible();
  });

  test('harus menampilkan error saat upload file invalid di Step 1', async ({ page }) => {
    // Setup dialog listener untuk menangkap alert
    let dialogMessage = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      console.log('Dialog detected:', dialogMessage);
      await dialog.accept();
    });

    // Pilih borrower
    await page.locator('label[for="borrower"]').click();

    // Create invalid file
    const invalidFile = {
      name: 'invalid.doc',
      mimeType: 'application/msword',
      buffer: Buffer.alloc(1024),
    };

    // Try to upload invalid file - this should trigger the alert
    console.log('Attempting to upload invalid file...');
    
    // Method 1: Direct file input (more reliable)
    await page.setInputFiles('input#ktp', invalidFile);
    
    // Wait for alert to appear and be handled
    await page.waitForTimeout(2000);
    
    // Verify alert message
    expect(dialogMessage).toBe('File harus berupa JPG, PNG, atau PDF.');
    
    console.log('Alert message verified:', dialogMessage);
  });

 
  // Test for file size validation
  test('harus menampilkan error saat upload file terlalu besar', async ({ page }) => {
    let dialogMessage = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      console.log('Dialog detected:', dialogMessage);
      await dialog.accept();
    });

    await page.locator('label[for="borrower"]').click();

    // Create large file (>5MB)
    const largeFile = {
      name: 'large.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.alloc(6 * 1024 * 1024), // 6MB file
    };

    console.log('Uploading large file...');
    await page.setInputFiles('input#ktp', largeFile);
    
    await page.waitForTimeout(2000);
    
    expect(dialogMessage).toBe('Ukuran file terlalu besar. Maksimal 5MB.');
  });
});