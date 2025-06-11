"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";

export enum UserRole {
  Admin = "admin",
  Lender = "lender",
  Borrower = "borrower",
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  showAccessDenied?: boolean;
}

const normalizeRole = (role: string | undefined | null): UserRole | null => {
  if (!role) {
    return null;
  }
  const normalized = role.toLowerCase();
  switch (normalized) {
    case "lender":
      return UserRole.Lender;
    case "admin":
      return UserRole.Admin;
    case "borrower":
      return UserRole.Borrower;
    default:
      return null;
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo,
  showAccessDenied = true,
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const [accessStatus, setAccessStatus] = useState<
    "checking" | "granted" | "denied" | "unauthorized"
  >("checking");

  const getDefaultDashboard = (userRole: UserRole): string => {
    switch (userRole) {
      case UserRole.Admin:
        return "/admin/dashboard";
      case UserRole.Lender:
        return "/lender/dashboard";
      case UserRole.Borrower:
        return "/borrower/dashboard";
    }
  };

  useEffect(() => {
    // console.log("Auth State:", {
    //   loading,
    //   isAuthenticated,
    //   userRole: user?.role,
    //   accessStatus,
    // });

    if (loading) {
      setAccessStatus("checking");
      return;
    }

    if (!isAuthenticated || !normalizeRole(user?.role)) {
      setAccessStatus("unauthorized");
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace("/login");
      }
      return;
    }

    const userRole = normalizeRole(user?.role);
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      setAccessStatus("denied");
      if (!showAccessDenied && !hasRedirected.current) {
        hasRedirected.current = true;
        router.replace(redirectTo || getDefaultDashboard(userRole));
      }
      return;
    }

    setAccessStatus("granted");
  }, [
    loading,
    isAuthenticated,
    user?.role,
    allowedRoles,
    redirectTo,
    showAccessDenied,
    router,
  ]);

  if (loading || accessStatus === "checking") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <span className="text-gray-700 text-lg font-medium">
            Memuat halaman...
          </span>
        </div>
      </div>
    );
  }

  if (accessStatus === "unauthorized" && hasRedirected.current) {
    return null;
  }

  if (accessStatus === "denied" && showAccessDenied && user) {
    const userRole = normalizeRole(user?.role);
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Akses Ditolak
          </h2>
          <p className="text-gray-600 mb-4">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Role Anda:{" "}
            <span className="font-medium">{userRole ?? "Unknown"}</span>
            <br />
            Role yang diizinkan:{" "}
            <span className="font-medium">{allowedRoles?.join(", ")}</span>
          </p>
          <button
            onClick={() => {
              const dashboardPath =
                userRole !== null ? getDefaultDashboard(userRole) : "/";
              router.push(dashboardPath);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Kembali ke halaman utama
          </button>
        </div>
      </div>
    );
  }

  if (accessStatus === "granted") {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
