import { randomInt } from 'node:crypto';

// Extract BASE_URL into a separate constant
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Base configuration
export const APP_CONFIG = {
  BASE_URL,
  TIMEOUTS: {
    PAGE_LOAD: 10000,
    FILTER: 1000,
    FILE_UPLOAD: 10000,
  },
  ROLES: {
    BORROWER: 'borrower',
    LENDER: 'lender',
    ADMIN: 'admin',
  },
  ROUTES: {
    LOGIN: `${BASE_URL}/login`,
    REGISTER: `${BASE_URL}/register`,
    BORROWER: {
      DASHBOARD: `${BASE_URL}/borrower/dashboard`,
      APPLY: `${BASE_URL}/borrower/apply`,
      LOANS: `${BASE_URL}/borrower/loans`,
      WALLET: `${BASE_URL}/borrower/wallet`,
    },
    LENDER: {
      DASHBOARD: `${BASE_URL}/lender/dashboard`,
      MARKETPLACE: `${BASE_URL}/lender/marketplace`,
      WALLET: `${BASE_URL}/lender/wallet`,
    },
    ADMIN: {
      DASHBOARD: `${BASE_URL}/admin/dashboard`,
      APPLICATIONS: `${BASE_URL}/admin/applications`,
    },
  },
  UI_TEXT: {
    LOGIN: {
      TITLE: 'Welcome back',
      SUBTITLE: 'Enter your credentials to access your account',
      BUTTON: 'Login',
      LOADING: 'Logging in...',
      ERROR: {
        TITLE: 'Login Failed',
        MESSAGE: 'Invalid email or password',
        CLOSE: 'Close',
      },
    },
    REGISTER: {
      SUCCESS_TITLE: 'Pendaftaran Berhasil!',
      SUCCESS_MESSAGE: 'Akun Anda telah berhasil dibuat',
      LOGIN_LINK: 'Masuk ke Akun',
    },
    LOAN_APPLICATION: {
      TITLE: 'Ajukan Pinjaman',
      SUBTITLE: 'Lengkapi formulir aplikasi',
      SUCCESS_MESSAGE: 'Aplikasi Terkirim!',
      SUMMARY_TITLE: 'Ringkasan Aplikasi Pinjaman',
      BUTTONS: {
        NEXT: 'Langkah Berikutnya',
        SUMMARY: 'Lihat Ringkasan',
        SUBMIT: 'Konfirmasi dan Kirim',
      },
      FORM_LABELS: {
        AMOUNT: 'Jumlah Pinjaman',
        INTEREST: 'Suku Bunga (%)',
        TERM: 'Jangka Waktu Pinjaman',
        PURPOSE: 'Tujuan Pinjaman',
        CASH_FLOW: 'Arus Kas Bulanan',
        DOC_COUNT: 'Jumlah Dokumen',
        DOC_TYPE: 'Jenis Dokumen',
      },
    },
    ADMIN: {
      APPLICATIONS_TITLE: 'Applications Management',
      APPROVE_TITLE: 'Approve Loan',
      APPROVE_BUTTON: 'Setujui Pinjaman',
    },
    WALLET: {
      TITLE: 'Wallet',
      DEPOSIT_BUTTON: 'Deposit Funds',
    },
    LOANS: {
      TITLE: 'My Loans',
    },
    MARKETPLACE: {
      TITLE: 'Loan Marketplace',
      INVEST_BUTTON: 'Investasi Sekarang',
      SUCCESS_MESSAGE: 'Investasi Berhasil!',
    },
  },
  VALIDATION_MESSAGES: {
    REQUIRED: 'wajib diisi',
    REQUIRED2: 'wajib diunggah',
    EMAIL: 'Email valid wajib diisi',
    KTP: 'Nomor KTP harus 16 digit',
    FILE_TYPE: 'File harus berupa JPG, PNG, atau PDF.',
    FILE_SIZE: 'Ukuran file terlalu besar. Maksimal 5MB.',
  },
};

// Helper function to generate unique ID
const generateUniqueId = (prefix: string): string => `${prefix}_${Date.now()}`;

// Helper function to generate random number
const generateRandomNumber = (min: number, max: number): string =>
  (Math.floor(Math.random() * (max - min + 1)) + min).toString();

// Credentials configuration
export const CREDENTIALS_CONFIG = {
  REGISTER: {
    BORROWER: {
      email: generateUniqueId('borrower_new') + '@gmail.com',
      password: 'Password123!',
      username: generateUniqueId('borrower_new'),
      fullName: 'Budi Santoso',
      phoneNumber: generateRandomNumber(1000000000, 9999999999),
      address: 'Jl. UMKM No. 123, Jakarta',
      dateOfBirth: '1990-01-01',
      idNumber: generateRandomNumber(1000000000000000, 9999999999999999),
      bankAccount: generateRandomNumber(1000000000, 9999999999),
      bankName: 'BCA',
      businessName: 'Toko Budi',
      businessType: 'Jasa',
      businessDuration: generateRandomNumber(1, 10),
    },
    LENDER: {
      email: generateUniqueId('lender_new') + '@gmail.com',
      password: 'Password123!',
      username: generateUniqueId('lender_new'),
      fullName: 'Ani Wijaya',
      phoneNumber: generateRandomNumber(1000000000, 9999999999),
      address: 'Jl. Investasi No. 456, Bandung',
      dateOfBirth: '1985-05-05',
      idNumber: generateRandomNumber(1000000000000000, 9999999999999999),
      bankAccount: '9876543210',
      bankName: 'Mandiri',
    },
    INVALID: {
      email: 'invalid_email',
      password: 'pass',
      username: '',
      fullName: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: '',
      idNumber: '123',
      bankAccount: '',
      bankName: '',
      businessName: '',
      businessType: '',
      businessDuration: '0',
    },
  },
  LOGIN: {
    BORROWER: {
      email: 'borrower7@gmail.com',
      password: 'password123',
    },
    LENDER: {
      email: 'lender7@gmail.com',
      password: 'password123',
    },
    ADMIN: {
      email: 'admin7@gmail.com',
      password: 'password123',
    },
    INVALID: {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    },
  },
};

// Dummy files configuration
export const DUMMY_FILES = {
  KTP: {
    path: './tests/fixtures/ktp.jpg',
    mimeType: 'image/jpeg',
    name: 'ktp.jpg',
  },
  SWAFOTO: {
    path: './tests/fixtures/swafoto.jpg',
    mimeType: 'image/jpeg',
    name: 'swafoto.jpg',
  },
  IZIN_USAHA: {
    path: './tests/fixtures/izin_usaha.pdf',
    mimeType: 'application/pdf',
    name: 'izin_usaha.pdf',
  },
};