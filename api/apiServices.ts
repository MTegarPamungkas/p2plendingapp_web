import { get } from "axios";
import apiClient from "../api/apiClient";
import {
  User,
  Metrics,
  LoginCredentials,
  //   AuthResponse,
  PaginatedResponse,
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  GetUsersParams,
  PaginatedUsersResponse,
  VerificationData,
  LoanParams,
  Loan,
  PaginatedLoansResponse,
  PortfolioResponse,
  InvestmentDetailsResponse,
  BorrowerSummaryResponse
} from "../types";
import { verify } from "crypto";
import { da } from "date-fns/locale";

// Auth services
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/v1/identity/login",
      credentials
    );
    return response.data;
  },

  getProfile: async (): Promise<{
    success: boolean;
    message: string;
    data: {
      user: User
    }
    timestamp: string; 
  }> => {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        user: User
      }
      timestamp: string; 
    }>("/v1/identity/me");
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      "/v1/identity/forgot-password",
      { email }
    );
    return response.data;
  },
};

// User services
export const userAPI = {
  getUsers: async (
    params: GetUsersParams = {}
  ): Promise<PaginatedUsersResponse> => {
    const response = await apiClient.get<PaginatedUsersResponse>(
      "/v1/identity/users",
      { params }
    );
    return response.data;
  },

  // submitVerification: async (verificationData: VerificationData): Promise<VerificationResponse> => {
  //   const response = await apiClient.post<VerificationResponse>(
  //     '/v1/identity/verify',
  //     verificationData
  //   );
  //   return response.data;
  // },

  approveUserVerification: async (
    userId: string,
    verificationData: VerificationData
  ): Promise<{ message: string }> => {
    const requestBody = {
      userId: userId,
      verificationMethod: verificationData.verificationMethod || "KYC",
      // documents: verificationData.documents || [],
    };

    const response = await apiClient.put<{ message: string }>(
      `/v1/identity/user/verify`,
      requestBody
    );
    return response.data;
  },

  // rejectUserVerification: async (
  //   userId: string,
  //   reason: string
  // ): Promise<{ message: string }> => {
  //   const response = await apiClient.post<{ message: string }>(
  //     `/v1/identity/users/${userId}/reject`,
  //     { reason }
  //   );
  //   return response.data;
  // },

  getUserIdentity: async (): Promise<User> => {
    const endpoint = "/v1/identity/me";
    const response = await apiClient.get<{
      data: any;
      user: User;
    }>(endpoint);
    return response.data.data.user;
  },

  // getUserById: async (id: string): Promise<{ user: User }> => {
  //   const response = await apiClient.get<{ user: User }>(
  //     `/v1/identity/users/${id}`
  //   );
  //   return response.data;
  // },

  updateUser: async (
    id: string,
    userData: Partial<User>
  ): Promise<{ user: User; message: string }> => {
    const response = await apiClient.put<{ user: User; message: string }>(
      `/v1/identity/users/${id}`,
      userData
    );
    return response.data;
  },

  // updateUserProfile: async (
  //   profileData: Partial<UserProfile> & {
  //     email?: string;
  //     phoneNumber?: string;
  //     ipAddress?: string;
  //     deviceInfo?: string;
  //   }
  // ): Promise<{ user: User; profile: UserProfile; message: string }> => {
  //   const response = await apiClient.put<{
  //     user: User;
  //     profile: UserProfile;
  //     message: string
  //   }>('/v1/identity/profile', profileData);
  //   return response.data;
  // },

  // deleteUser: async (id: string): Promise<ApiResponse> => {
  //   const response = await apiClient.delete<ApiResponse>(
  //     `/v1/identity/users/${id}`
  //   );
  //   return response.data;
  // },

  // uploadKYCDocuments: async (
  //   files: File[],
  //   documentTypes: string[]
  // ): Promise<DocumentUploadResponse> => {
  //   const formData = new FormData();
  //   files.forEach((file, index) => {
  //     formData.append('documents', file);
  //     formData.append('documentTypes', documentTypes[index]);
  //   });

  //   const response = await apiClient.post<DocumentUploadResponse>(
  //     '/v1/identity/upload-kyc',
  //     formData,
  //     {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     }
  //   );
  //   return response.data;
  // },

  // getCreditScore: async (userId?: string): Promise<CreditScoreResponse> => {
  //   const endpoint = userId
  //     ? `/v1/identity/users/${userId}/credit-score`
  //     : '/v1/identity/credit-score';
  //   const response = await apiClient.get<CreditScoreResponse>(endpoint);
  //   return response.data;
  // },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    ipAddress?: string;
    deviceInfo?: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/v1/identity/change-password",
      passwordData
    );
    return response.data;
  },

  logout: async (logoutData?: {
    ipAddress?: string;
    deviceInfo?: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/v1/identity/logout",
      logoutData
    );
    return response.data;
  },
};

export const systemAPI = {
  getSystemMetrics: async (): Promise<Metrics> => {
    const response = await apiClient.get<Metrics>("/metrics");
    return response.data.data;
  },
};

// Posts services
// export const postAPI = {
//  getPosts: async (params: {
//     page?: number;
//     limit?: number;
//     userId?: string;
//     search?: string;
//   } = {}): Promise<PaginatedResponse<Post>> => {
//     const response = await apiClient.get<PaginatedResponse<Post>>('/posts', { params });
//     return response.data;
//   },

//   getPostById: async (id: string): Promise<{ post: Post }> => {
//     const response = await apiClient.get<{ post: Post }>(`/posts/${id}`);
//     return response.data;
//   },

//   createPost: async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ post: Post }> => {
//     const response = await apiClient.post<{ post: Post }>('/posts', postData);
//     return response.data;
//   },

//   updatePost: async (id: string, postData: Partial<Post>): Promise<{ post: Post }> => {
//     const response = await apiClient.put<{ post: Post }>(`/posts/${id}`, postData);
//     return response.data;
//   },

//   deletePost: async (id: string): Promise<ApiResponse> => {
//     const response = await apiClient.delete<ApiResponse>(`/posts/${id}`);
//     return response.data;
//   }
// };

// import apiClient from '../api/apiClient';
// import {
//   User,
//   Metrics,
//   LoginCredentials,
//   RegisterData,
//   AuthResponse,
//   PaginatedResponse,
//   ApiResponse
// } from '../types';

// // Auth services
// export const authAPI = {
//   login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
//     const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
//     return response.data;
//   },

//   register: async (userData: RegisterData): Promise<AuthResponse> => {
//     const response = await apiClient.post<AuthResponse>('/auth/register', userData);
//     return response.data;
//   },

//   getProfile: async (): Promise<{ user: User }> => {
//     const response = await apiClient.get<{ user: User }>('/auth/me');
//     return response.data;
//   },

//   refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
//     const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh', {
//       refreshToken
//     });
//     return response.data;
//   },

//   forgotPassword: async (email: string): Promise<ApiResponse> => {
//     const response = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
//     return response.data;
//   }
// };

// // User services
// export const userAPI = {
//   getUsers: async (params: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     role?: string
//   } = {}): Promise<PaginatedResponse<User>> => {
//     const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
//     return response.data;
//   },

//   getUserById: async (id: string): Promise<{ user: User }> => {
//     const response = await apiClient.get<{ user: User }>(`/users/${id}`);
//     return response.data;
//   },

//   updateUser: async (id: string, userData: Partial<User>): Promise<{ user: User }> => {
//     const response = await apiClient.put<{ user: User }>(`/users/${id}`, userData);
//     return response.data;
//   },

//   deleteUser: async (id: string): Promise<ApiResponse> => {
//     const response = await apiClient.delete<ApiResponse>(`/users/${id}`);
//     return response.data;
//   },

//   uploadAvatar: async (id: string, file: File): Promise<{ user: User }> => {
//     const formData = new FormData();
//     formData.append('avatar', file);
//     const response = await apiClient.post<{ user: User }>(`/users/${id}/avatar`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }
// };

// // Fix: Perbaiki systemAPI untuk handle metrics dengan benar
// export const systemAPI = {
//   getSystemMetrics: async (): Promise<Metrics> => {
//     try {
//       const response = await apiClient.get<Metrics>('/metrics');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching system metrics:', error);
//       // Return default metrics jika gagal
//       return {
//         totalLoans: 1,
//         totalActiveLoans: 1,
//         totalFundedAmount: 1,
//         totalUsers: 1,
//         totalTransactions: 1,
//         platformHealth: "healthy",
//         lastUpdated: "jahsjas"
//       } as Metrics;
//     }
//   },

//   // Tambahkan method untuk health check
//   healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
//     const response = await apiClient.get<{ status: string; timestamp: string }>('/health');
//     return response.data;
//   }
// };

// Posts services (if needed later)
// export const postAPI = {
//   getPosts: async (params: {
//     page?: number;
//     limit?: number;
//     userId?: string;
//     search?: string;
//   } = {}): Promise<PaginatedResponse<Post>> => {
//     const response = await apiClient.get<PaginatedResponse<Post>>('/posts', { params });
//     return response.data;
//   },

//   getPostById: async (id: string): Promise<{ post: Post }> => {
//     const response = await apiClient.get<{ post: Post }>(`/posts/${id}`);
//     return response.data;
//   },

//   createPost: async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ post: Post }> => {
//     const response = await apiClient.post<{ post: Post }>('/posts', postData);
//     return response.data;
//   },

//   updatePost: async (id: string, postData: Partial<Post>): Promise<{ post: Post }> => {
//     const response = await apiClient.put<{ post: Post }>(`/posts/${id}`, postData);
//     return response.data;
//   },

//   deletePost: async (id: string): Promise<ApiResponse> => {
//     const response = await apiClient.delete<ApiResponse>(`/posts/${id}`);
//     return response.data;
//   }
// };

// Loan services
export const loanAPI = {
  createLoan: async (loanParam: LoanParams): Promise<{ message: string }> => {
    const requestBody = {
      amount: loanParam.amount,
      term: loanParam.term,
      purpose: loanParam.purpose,
      interestRate: loanParam.interestRate,
      scoreFactors: loanParam.scoreFactors,
      supportingDocuments: loanParam.supportingDocuments,
    };

    const response = await apiClient.post<{ message: string }>(
      `/v1/loan/apply`,
      requestBody
    );
    return response.data;
  },

  getAllLoans: async (): Promise<PaginatedLoansResponse> => {
    const response = await apiClient.get<PaginatedLoansResponse>(`/v1/loan/all`);
    return response.data;
  },
  getAvailableLoansForFunding: async (): Promise<PaginatedLoansResponse> => {
    const response = await apiClient.get<PaginatedLoansResponse>(`/v1/loan/available`);
    return response.data;
  },

  submitDocument: async (type: string, file: File): Promise<{
    success: boolean;
    message: string;
    data: {
      id: string;
      name: string;
      type: string;
      filePath: string;
      blockchainDocumentId: string;
      userId: string;
      uploadedAt: string;
    };
    timestamp: string;
  }> => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);

    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        id: string;
        name: string;
        type: string;
        filePath: string;
        blockchainDocumentId: string;
        userId: string;
        uploadedAt: string;
      };
      timestamp: string;
    }>(`/v1/loan/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data) {
      throw new Error("Failed to upload document: No response data");
    }
    if (!response.data.success) {
      throw new Error(`Failed to upload document: ${response.data.message}`);
    }
    return response.data;
  },

  getLoanDetailById: async (loanId: string): Promise<any> => {
    const requestBody = {
      loanId: loanId
    };
    const response = await apiClient.post<any>(`/v1/loan`, requestBody);
    return response.data;
  },

  getDocumentDetails: async (docId: string): Promise<any> => {
    const requestBody = {
      docId: docId
    };
    const response = await apiClient.post<any>(`/v1/loan/documents/details`, requestBody);
    return response.data;
  },

  getRepaymentScheduleById: async (loanId: string): Promise<any> => {
    const requestBody = {
      loanId: loanId
    };
    const response = await apiClient.post<any>(`/v1/loan/repayment/schedule`, requestBody);
    return response.data;
  },

  getLogsLoan: async (loanId: string): Promise<any> => {
    const requestBody = {
      loanId: loanId
    };
    const response = await apiClient.post<any>(`/v1/loan/logs`, requestBody);
    return response.data;
  },


  getAllLoansByUser: async (): Promise<PaginatedLoansResponse> => {
    const response = await apiClient.get<PaginatedLoansResponse>(`/v1/loan/user`);
    return response.data;
  },

  getUserPortfolio: async (): Promise<PortfolioResponse> => {
    const response = await apiClient.get<PortfolioResponse>(`/v1/loan/user/portfolio`);
    return response.data;
  },

  getUserSummary: async (): Promise<BorrowerSummaryResponse> => {
    const response = await apiClient.get<BorrowerSummaryResponse>(`/v1/loan/user/summary`);
    return response.data;
  },

  getInvestmentDetails: async (investmentId: string): Promise<InvestmentDetailsResponse> => {
    const requestBody = {
      investmentId: investmentId
    };
    const response = await apiClient.post<InvestmentDetailsResponse>(`/v1/loan/user/portfolio/details/investment`, requestBody);
    return response.data;
  },


  approveLoan: async (
    loanId: string,
  ): Promise<{ message: string }> => {
    const requestBody = {
      loanId: loanId
    };

    const response = await apiClient.put<{ message: string }>(
      `/v1/loan/approve`,
      requestBody
    );
    return response.data;
  },

  investInLoan: async (
    loanId: string,
    amount: number
  ): Promise<{ message: string }> => {
    const requestBody = {
      loanId: loanId,
      amount: amount
    };

    const response = await apiClient.put<{ message: string }>(
      `/v1/loan/invest`,
      requestBody
    );
    return response.data;
  },

  
};

// Wallet API services
export const walletAPI = {
  /**
   * Deposit amount into user's wallet
   * @param amount - Amount to deposit
   * @returns Promise with success message
   */
  deposit: async (amount: number): Promise<{ message: string }> => {
    const requestBody = {
      amount: amount,
    };

    const response = await apiClient.post<{ message: string }>(
      `/v1/wallet/deposit`,
      requestBody
    );
    return response.data;
  },

  /**
   * Withdraw amount from user's wallet
   * @param amount - Amount to withdraw
   * @returns Promise with success message
   */
  withdraw: async (amount: number): Promise<{ message: string }> => {
    const requestBody = {
      amount: amount,
    };

    const response = await apiClient.post<{ message: string }>(
      `/v1/wallet/withdraw`,
      requestBody
    );
    return response.data;
  },

  /**
   * Get wallet balance of the authenticated user
   * @returns Promise with wallet balance data
   */
  getWalletBalance: async (): Promise<{ balance: number }> => {
    const response = await apiClient.get<{ balance: number }>(
      `/v1/wallet/balance`
    );
    return response.data;
  },

  /**
   * Get wallet details of the authenticated user
   * @returns Promise with wallet details
   */
  getWallet: async (): Promise<any> => {
    const response = await apiClient.get<any>(`/v1/wallet`);
    return response.data;
  },


  makePayment: async (loanId: string, amount: number): Promise<{ message: string }> => {
    const requestBody = {
      loanId: loanId,
      amount: amount,
    };

    const response = await apiClient.put<{ message: string }>(
      `/v1/loan/payment`,
      requestBody
    );
    return response.data;
  },
};