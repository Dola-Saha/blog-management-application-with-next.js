"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { clearAuthStorage, getCachedUser, getToken, setAuthStorage, setCachedUser } from "@/utils/auth";
import { getProfile } from "@/services/user.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const cachedUser = getCachedUser();
    if (cachedUser) setUser(cachedUser);

    getProfile()
      .then((res) => {
        setUser(res.data.data);
        setCachedUser(res.data.data);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          clearAuthStorage();
          setUser(null);
        } else if (cachedUser) {
          setUser(cachedUser);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, loggedInUser) => {
    setAuthStorage(token, loggedInUser);
    setUser(loggedInUser);
  };

  const logout = () => {
    clearAuthStorage();
    sessionStorage.removeItem("session-expired");
    setUser(null);
    window.location.replace("/login");
  };

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
    setCachedUser(nextUser);
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
