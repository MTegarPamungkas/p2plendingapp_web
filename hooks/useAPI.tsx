"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseAPIOptions {
  requireAuth?: boolean; // Default: true
  enabled?: boolean; // Default: true
}

export const useAPI = <T,>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAPIOptions = {}
): UseAPIResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { requireAuth = true, enabled = true } = options;

  const fetchData = useCallback(async (): Promise<void> => {
    // Jika disabled, jangan fetch
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Jika memerlukan auth dan belum authenticated, tunggu
    if (requireAuth && !isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message || err.message || "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }, [apiFunction, isAuthenticated, requireAuth, enabled]);

  useEffect(() => {
    // Tunggu auth loading selesai jika memerlukan auth
    if (requireAuth && authLoading) {
      return;
    }

    fetchData();
  }, [fetchData, authLoading, requireAuth, ...dependencies]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Hook khusus untuk public API (tidak memerlukan auth)
export const usePublicAPI = <T,>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
): UseAPIResult<T> => {
  return useAPI(apiFunction, dependencies, { requireAuth: false });
};

// Hook untuk mutations (POST, PUT, DELETE)
export const useMutation = <TData, TVariables = void>() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      apiFunction: (variables: TVariables) => Promise<TData>,
      variables: TVariables
    ): Promise<{ data?: TData; error?: string }> => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFunction(variables);
        return { data };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Terjadi kesalahan";
        setError(errorMessage);
        return { error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const mutateAsync = useCallback(
    async (apiFunction: () => Promise<TData>): Promise<TData | null> => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFunction();
        return data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Terjadi kesalahan";
        setError(errorMessage);
        console.error("Mutation error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutateAsync, mutate, loading, error };
};
