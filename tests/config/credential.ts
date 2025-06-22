import { randomInt } from 'node:crypto';

// Base URL configuration
export const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

// Generate unique values for dynamic data
const generateUniqueValues = () => ({
  timestamp: Date.now(),
  randomPhone: () => `0${randomInt(1000000000, 9999999999)}`,
  randomIdNumber: () => `${randomInt(1000000000000000, 9999999999999999)}`,
  randomBankAccount: () => `${randomInt(1000000000, 9999999999)}`,
  randomBusinessDuration: () => `${randomInt(1, 10)}`,
});

// Default configuration scenarios for registration
const defaultScenarios = {
  borrower: {
    email: (unique: { timestamp: any; }) => `borrower_new_${unique.timestamp}@gmail.com`,
    username: (unique: { timestamp: any; }) => `borrower_new_${unique.timestamp}`,
    password: 'Password123!',
    fullName: 'Budi Santoso',
    phoneNumber: (unique: { randomPhone: () => any; }) => unique.randomPhone(),
    address: 'Jl. UMKM No. 123, Jakarta',
    dateOfBirth: '1990-01-01',
    idNumber: (unique: { randomIdNumber: () => any; }) => unique.randomIdNumber(),
    bankAccount: (unique: { randomBankAccount: () => any; }) => unique.randomBankAccount(),
    bankName: 'BCA',
    businessName: 'Toko Budi',
    businessType: 'Jasa',
    businessDuration: (unique: { randomBusinessDuration: () => any; }) => unique.randomBusinessDuration(),
  },
  lender: {
    email: (unique: { timestamp: any; }) => `lender_new_${unique.timestamp}@gmail.com`,
    username: (unique: { timestamp: any; }) => `lender_new_${unique.timestamp}`,
    password: 'Password123!',
    fullName: 'Ani Wijaya',
    phoneNumber: (unique: { randomPhone: () => any; }) => unique.randomPhone(),
    address: 'Jl. Investasi No. 456, Bandung',
    dateOfBirth: '1985-05-05',
    idNumber: (unique: { randomIdNumber: () => any; }) => unique.randomIdNumber(),
    bankAccount: '9876543210',
    bankName: 'Mandiri',
  },
  invalid: {
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
};

// Registration credentials
export const registerCredentials = {
  borrower: Object.fromEntries(
    Object.entries(defaultScenarios.borrower).map(([key, value]) => 
      [key, typeof value === 'function' ? value(generateUniqueValues()) : value]
    )
  ),
  lender: Object.fromEntries(
    Object.entries(defaultScenarios.lender).map(([key, value]) => 
      [key, typeof value === 'function' ? value(generateUniqueValues()) : value]
    )
  ),
  invalid: defaultScenarios.invalid,
};

// Login credentials for existing accounts
export const loginCredentials = {
  borrower: {
    email: 'borrower7@gmail.com',
    password: 'password123',
  },
  lender: {
    email: 'lender7@gmail.com',
    password: 'password123',
  },
  admin: {
    email: 'admin7@gmail.com',
    password: 'password123',
  },
  invalid: {
    email: 'wrong@example.com',
    password: 'wrongpassword',
  },
};

// Dummy files for document upload
export const dummyFiles = {
  ktp: {
    path: './tests/fixtures/ktp.jpg',
    mimeType: 'image/jpeg',
    name: 'ktp.jpg',
  },
  swafoto: {
    path: './tests/fixtures/swafoto.jpg',
    mimeType: 'image/jpeg',
    name: 'swafoto.jpg',
  },
  izin_usaha: {
    path: './tests/fixtures/izin_usaha.pdf',
    mimeType: 'application/pdf',
    name: 'izin_usaha.pdf',
  },
};

// Test-specific configurations
export const TEST_CONFIG = {
  LOGIN: {
    PAGE_TITLE: 'Welcome back',
    PAGE_SUBTITLE: 'Enter your credentials to access your account',
    FORM_LABELS: {
      EMAIL: 'Email',
      PASSWORD: 'Password',
    },
    BUTTONS: {
      LOGIN: 'Login',
      LOGGING_IN: 'Logging in...',
      CLOSE: 'Close',
    },
    LINKS: {
      REGISTER: 'Register',
    },
    ERROR_MESSAGES: {
      LOGIN_FAILED: 'Login Failed',
      INVALID_CREDENTIALS: 'Invalid email or password',
    },
    ROUTES: {
      LOGIN: '/login',
      BORROWER_DASHBOARD: '/borrower/dashboard',
      LENDER_DASHBOARD: '/lender/dashboard',
      ADMIN_DASHBOARD: '/admin/dashboard',
    },
  },
  REGISTER: {
    SUCCESS_MESSAGE: 'Pendaftaran Berhasil!',
    SUCCESS_SUBMESSAGE: 'Akun Anda telah berhasil dibuat',
    BUTTONS: {
      NEXT: 'Langkah Berikutnya',
      SUBMIT: 'Daftar',
    },
    LINKS: {
      LOGIN: 'Masuk ke Akun',
    },
    ERROR_MESSAGES: {
      REQUIRED_USERNAME: 'Username wajib diisi',
      REQUIRED_FULLNAME: 'Nama lengkap wajib diisi',
      REQUIRED_EMAIL: 'Email valid wajib diisi',
      REQUIRED_PHONE: 'Nomor telepon wajib diisi',
      REQUIRED_ADDRESS: 'Alamat wajib diisi',
      REQUIRED_DOB: 'Tanggal lahir wajib diisi',
      INVALID_ID: 'Nomor KTP harus 16 digit',
      REQUIRED_KTP: 'Dokumen KTP wajib diunggah',
      REQUIRED_SWAFOTO: 'Swafoto dengan KTP wajib diunggah',
      INVALID_FILE: 'File harus berupa JPG, PNG, atau PDF.',
      FILE_TOO_LARGE: 'Ukuran file terlalu besar. Maksimal 5MB.',
    },
    ROUTES: {
      REGISTER: '/register',
    },
  },
  LOAN_APPLICATION: {
    PAGE_TITLE: 'Ajukan Pinjaman',
    PAGE_SUBTITLE: 'Lengkapi formulir aplikasi',
    SUCCESS_MESSAGE: 'Aplikasi Terkirim!',
    SUMMARY_TITLE: 'Ringkasan Aplikasi Pinjaman',
    BUTTONS: {
      NEXT: 'Langkah Berikutnya',
      SUMMARY: 'Lihat Ringkasan',
      SUBMIT: 'Konfirmasi dan Kirim',
    },
    ROUTES: {
      BORROWER_DASHBOARD: '/borrower/dashboard',
      LOAN_APPLY: '/borrower/apply',
    },
    FORM_LABELS: {
      AMOUNT: 'Jumlah Pinjaman',
      INTEREST: 'Suku Bunga (%)',
      TERM: 'Jangka Waktu Pinjaman',
      PURPOSE: 'Tujuan Pinjaman',
      CASH_FLOW: 'Arus Kas Bulanan',
      DOC_COUNT: 'Jumlah Dokumen',
      DOC_TYPE: 'Jenis Dokumen 1',
    },
    LOAN_DATA: {
      AMOUNT: '50000000',
      INTEREST: '5',
      TERM: '3 bulan',
      PURPOSE: 'Ekspansi Bisnis',
      CASH_FLOW: '10000000',
      DOC_COUNT: '1',
      DOC_TYPE: 'Laporan Keuangan',
    },
  },
  ADMIN_LOAN_APPROVAL: {
    PAGE_TITLE: 'Applications Management',
    LOAN_DETAILS: {
      PURPOSE: 'expansion',
      AMOUNT: 'Rp 50.000.000',
      STATUS: 'PENDING_APPROVAL',
      INTEREST: '5% p.a.',
      DURATION: '3 months',
      APPROVED_STATUS: 'APPROVED',
    },
    BUTTONS: {
      OPEN_MENU: 'Open menu',
      VIEW_DETAILS: 'View Details',
      APPROVE_LOAN: 'Approve Loan',
      CONFIRM_APPROVE: 'Setujui Pinjaman',
    },
    SUCCESS_MESSAGE: 'This loan was approved for',
    ROUTES: {
      APPLICATIONS: '/admin/applications',
      APPLICATION_DETAILS: '/admin/applications/*',
    },
    FORM_LABELS: {
      SEARCH: 'Search applications...',
    },
  },
  BORROWER_PAYMENT: {
    PAGE_TITLE: 'My Loans',
    WALLET_TITLE: 'Wallet',
    LOAN_DETAILS: {
      PURPOSE: 'Expansion',
      AMOUNT: 'Rp 50.000.000',
      INTEREST: '5.0% p.a.',
      DURATION: '3 months',
      STATUS: 'ACTIVE',
      PAYMENT_DISTRIBUTION: '+Rp 18.783.333',
    },
    PAYMENT_DETAILS: {
      DEPOSIT_AMOUNT: '17000000',
      PAYMENT_STATUS: 'Pending',
      PAID_STATUS: 'Paid',
    },
    BUTTONS: {
      DEPOSIT: 'Deposit Funds',
      MAKE_PAYMENT: 'Make Payment',
    },
    ROUTES: {
      WALLET: '/borrower/wallet',
      LOANS: '/borrower/loans',
      LOAN_DETAILS: '/borrower/loans/*',
      LENDER_WALLET: '/lender/wallet',
    },
    FORM_LABELS: {
      AMOUNT: 'amount',
    },
  },
  LENDER_FUNDING: {
    PAGE_TITLE: 'Loan Marketplace',
    WALLET_TITLE: 'Wallet',
    LOAN_DETAILS: {
      PURPOSE: 'expansion Loan',
      AMOUNT: 'Rp 50.000.000',
      INTEREST: '5.00% p.a.',
      DURATION: '3 months',
    },
    INVESTMENT_DETAILS: {
      DEPOSIT_AMOUNT: '1000000',
      INVESTMENT_AMOUNT: '500000',
    },
    BUTTONS: {
      DEPOSIT: 'Deposit Funds',
      VIEW_OPPORTUNITY: 'View Opportunity',
      INVEST: 'Investasi Sekarang',
      CONFIRM_INVEST: (amount: string) => `Invest Rp ${parseInt(amount).toLocaleString('id-ID')}`,
    },
    SUCCESS_MESSAGE: 'Investasi Berhasil!',
    SUCCESS_STATUS: 'Terkonfirmasi',
    ROUTES: {
      WALLET: '/lender/wallet',
      MARKETPLACE: '/lender/marketplace',
      MARKETPLACE_DETAILS: '/lender/marketplace/*',
    },
    FORM_LABELS: {
      AMOUNT: 'amount',
      INVESTMENT_AMOUNT: 'Jumlah Investasi',
    },
  },
};