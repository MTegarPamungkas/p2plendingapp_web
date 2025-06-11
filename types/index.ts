import { Numerals } from "react-day-picker";


export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      blockchainUserId: string;
      profile: {
        profilePicture: string;
        idNumber: string;
        preferences: {};
        createdAt: string;
        updatedAt: string;
        id: string;
        userId: string;
        fullName: string;
        address: string;
        dateOfBirth: string;
        phoneNumber: string;
      };
      lastLogin: string | null;
    };
  }
}

export type BorrowerSummaryResponse = {
  success: boolean;
  data: {
    borrowerId: string;
    totalBorrowed: number;
    totalPaid: number;
    totalOutstanding: number;
    activeLoans: number;
    completedLoans: number;
    rejectedLoans: number;
    creditScore: number | null;
    loanSummaries: {
      loanId: string;
      amount: number;
      status: string; // e.g., "active", "completed", "rejected"
      paid: number;
      outstanding: number;
      interestRate: number;
      term: number;
    }[];
  };
};


export interface UserProfile {
    phoneNumber: string;
    id: string;
    userId: string;
    fullName: string;
    profilePicture: string | null;
    address: string;
    dateOfBirth: string;
    idNumber: string;
    preferences: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface document {
    id: string;
    userId: string;
    type: string;
    filePath: string;
    fileHash: string;
    uploadedAt: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface BankAccount {
    id: string;
    userId: string;
    bankName: string;
    accountNumber: string;
    createdAt: string;
    isPrimary: boolean ;
  }

  export interface BusinessProfile {
    id: string;
    userId: string;
    businessName: string;
    businessType: string
    businessDuration: number,
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    id: string;
    username: string;
    email: string;
    role: 'borrower' | 'lender' | 'admin' | string; // tambahkan tipe lain kalau ada
    blockhainUserId: string;
    phoneNumber: string;
    createdAt: string;
    profile: UserProfile;
    documents: document[];
    bankAccounts: BankAccount[];
    businessProfile: BusinessProfile | null;
    lastLogin: string | null;
    status: 'active' | 'pending' | 'suspended'; // bisa disesuaikan jika ada enum
    verified: boolean ; // bisa disesuaikan jika ada enum
  }

  export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: User['status'];
    verified?: boolean;
  }

  export interface GetLoanDetailParams {
    loanId: string;
  }
  export interface PaginatedUsersResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
  }

  export interface PaginatedLoansResponse {
    data: Loan[];
    total: number;
    page: number;
    limit: number;
  }

  export interface VerificationData {
    // documents: DocumentUpload[];
    verificationMethod: string;
    ipAddress?: string;
    deviceInfo?: string;
  }

  export interface DocumentUpload {
    type: string;
    path: string;
    hash: string;
  }

  export interface ScoreFactors {
    loanAmount: number;
    monthlyCashFlow: number;
    incomeSources: string[]; 
  }
  
  export interface LoanParams {
    amount: number;
    term: number; 
    purpose: string;
    interestRate: number; 
    scoreFactors: ScoreFactors;
    supportingDocuments?: string[];
  }
  

  export interface CreditScoreBreakdown {
    amountsOwed: number;
    creditHistory: number;
    creditMix: number;
    newCredit: number;
    paymentHistory: number;
  };
  
  export interface Loan {
    loanId: string;
    borrowerId: string;
    amount: number;
    term: number;
    purpose: string;
    interestRate: number;
    currentFunding: number;
    fundingTarget: number;
    creditScore: number;
    creditScoreBreakdown: CreditScoreBreakdown;
    status: string;
    createdAt: string;
    applications: any[];
    payments: any[];   
  };

  
  
  export interface Metrics {
    [x: string]: any;
    totalLoans: number;
    totalActiveLoans: number;
    totalFundedAmount: number;
    totalVerifiedUsers: number;
    totalTransactions: number;
    platformHealth: string;
    lastUpdated: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
export interface RegisterParams {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  idNumber: string;
  bankAccount: string;
  bankName: string;
  businessName?: string; // Opsional untuk borrower
  businessType?: string; // Opsional untuk borrower
  businessDuration?: string; // Opsional untuk borrower
  password: string;
  confirmPassword: string;
  userType: "borrower" | "lender";
  supportingDocuments: { file: File; type: string }[]; // File dan tipe dokumen
}

  
  
//   export interface AuthResponse {
//     user: User;
//     token: string;
//     refreshToken: string;
//     expiresIn: number;
//   }

  // export interface LoginResponse {
  //   data: any;
  //   token: string;
  //   tokenType: string; // e.g. "Bearer"
  //   expiresIn: string; // e.g. "24h"
  //   user: User;
  // }

  export interface RegisterResponse {
    id: string;
    username: string;
    email: string;
    fullName: string;
    blockchainUserId: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
  }

  


  //portolfolio

  export interface PaymentDistribution {
    transactionId: string;
    paymentId: number;
    amountReceived: number;
    platformFee: number;
    timestamp: string;
  }
  
   export interface FutureDistribution {
    installmentNumber: number;
    dueDate: string;
    principalShare: number;
    interestShare: number;
    platformFee: number;
    amountAfterFee: number;
  }
  
  export interface LoanDetails {
    borrowerId: string;
    purpose: string;
    amount: number;
    creditScore: number;
    fundingProgress: string; // Percentage as string (e.g., "100.00%")
  }
  
  export interface Investment {
    loanId: string;
    investmentAmount: number;
    investmentIds: string[];
    loanStatus: 'APPROVED' | 'FUNDING' | 'FUNDED' | 'ACTIVE' | 'COMPLETED' | 'PENDING_APPROVAL';
    interestRate: number;
    term: number;
    totalReceived: number;
    totalPlatformFeeReceived: number;
    totalFuturePrincipal: number;
    totalFutureInterest: number;
    totalFuturePlatformFee: number;
    expectedReturn: number;
    paymentDistributions: PaymentDistribution[];
    futureDistributions: FutureDistribution[];
    loanDetails: LoanDetails;
  }
  
  export interface LoanStatusDistribution {
    APPROVED: number;
    FUNDING: number;
    FUNDED: string;
    ACTIVE: number;
    COMPLETED: number;
    PENDING_APPROVAL: number;
  }
  
  export interface PerformanceMetrics {
    roi: number;
    activeInvestments: number;
    completedInvestments: number;
    expectedOverallROI: number;
  }
  
  export interface LenderPortfolioData {
    lenderId: string;
    totalInvested: number;
    totalReceived: number;
    totalExpectedReturn: number;
    totalPlatformFees: number;
    totalFuturePrincipal: number;
    totalFutureInterest: number;
    totalFuturePlatformFees: number;
    investments: Investment[];
    loanStatusDistribution: LoanStatusDistribution;
    performanceMetrics: PerformanceMetrics;
    lastUpdated: string;
  }
  
  export interface PortfolioResponse {
    data: LenderPortfolioData;
    timestamp: string;
  }





  export interface PaymentDistributionDetails {
    transactionId: string;
    paymentId: string;
    amountReceived: number;
    platformFee: number;
    netAmount: number;
    timestamp: string;
    installmentNumber: number;
    principalShare: number;
    interestShare: number;
    totalShare: number;
  }
  
  export interface FutureDistribution {
    installmentNumber: number;
    dueDate: string;
    principalShare: number;
    interestShare: number;
    totalShare: number;
    platformFee: number;
    amountAfterFee: number;
  }
  
  export interface LoanDetails {
    borrowerId: string;
    purpose: string;
    amount: number;
    creditScore: number;
    fundingProgress: string; // Percentage as string (e.g., "100.00%")
    createdAt: string;
    approvedAt: string | null;
    fundedAt: string | null;
    fundsReleasedAt: string | null;
    completedAt: string | null;
  }
  
  export interface RepaymentSchedule {
    totalInstallments: number;
    paidInstallments: number;
    standardMonthlyPayment: number;
    totalInterest: number;
  }
  
  export interface InvestmentDetailsData {
    investmentId: string;
    loanId: string;
    amount: number;
    timestamp: string;
    loanStatus: 'APPROVED' | 'FUNDING' | 'FUNDED' | 'ACTIVE' | 'COMPLETED' | 'PENDING_APPROVAL';
    interestRate: number;
    repaymentDetails: {
      totalInstallments: number;
      paidInstallments: number;
      standardMonthlyPayment: number;
      totalInterest: number;
      paymentDistributions: PaymentDistributionDetails[];
      totalReceived: number;
      totalPlatformFeeReceived: number;
      futureDistributions: FutureDistribution[];
      totalFuturePrincipal: number;
      totalFutureInterest: number;
      totalFuturePlatformFee: number;
      totalFutureAmount: number;
      totalFutureAfterFee: number;
      expectedTotalReturn: number;
      totalPlatformFee: number;
      roi: number;
    };
    loanDetails: {
      purpose: string;
      term: number;
      totalAmount: number;
      currentFunding: number;
      fundingTarget: number;
      createdAt: string;
      fundedAt: string | null;
      approvedAt: string | null;
      fundingProgress: string;
    };
  }
  
  export interface InvestmentDetailsResponse {
    data: InvestmentDetailsData;
    timestamp: string;
  }







  
