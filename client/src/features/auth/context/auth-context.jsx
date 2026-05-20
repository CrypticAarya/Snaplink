import { createContext, useContext, useEffect, useMemo } from "react";
import { getCurrentUser } from "@/services/api/auth";
import useFetch from "@/hooks/use-fetch";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);

  const isAuthenticated = user?.role === "authenticated";

  useEffect(() => {
    fetchUser();
    // Intentionally run once on mount; fetchUser identity changes each render via useFetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      fetchUser,
    }),
    [user, loading, isAuthenticated, fetchUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
