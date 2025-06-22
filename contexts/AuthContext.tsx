import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  LoginCredentials,
  RegisterResponse,
  LoginResponse,
} from "../types";
import apiClient from "../api/apiClient";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: string; data?: LoginResponse }>;
  register: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string; data?: RegisterResponse }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan dalam AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  const checkAuth = async (): Promise<void> => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      try {
        const response = await apiClient.get<{
          data: { user: User };
        }>("/v1/identity/me");

        setUser({
          id: response.data.data.user.id,
          username: response.data.data.user.username,
          email: response.data.data.user.email,
          role: response.data.data.user.role,
          blockhainUserId: response.data.data.user.blockhainUserId,
          profile: response.data.data.user.profile,
          lastLogin: response.data.data.user.lastLogin,
          phoneNumber: response.data.data.user.phoneNumber,
          createdAt: response.data.data.user.createdAt,
          documents: response.data.data.user.documents,
          bankAccounts: response.data.data.user.bankAccounts,
          businessProfile: response.data.data.user.businessProfile,
          status: "active",
          verified: response.data.data.user.verified,
        });
        setToken(savedToken);
      } catch (error) {
        localStorage.removeItem("authToken");
        setToken(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (
    credentials: LoginCredentials
  ): Promise<{
    success: boolean;
    error?: string;
    data?: LoginResponse;
  }> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/v1/identity/login",
        credentials
      );

      const { token } = response.data.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", token);
      }

      setToken(token);
      await checkAuth(); // Fetch user data immediately after login

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Login gagal",
      };
    }
  };

  const register = async (
    formData: FormData
  ): Promise<{ success: boolean; error?: string; data?: RegisterResponse }> => {
    try {
      const response = await apiClient.post<RegisterResponse>(
        "/v1/identity/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registrasi gagal",
      };
    }
  };

  const logout = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
    }

    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
