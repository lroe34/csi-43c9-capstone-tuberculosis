"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "@/utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((userData) => {
    console.log("AuthContext: Setting user state after login", userData);
    setUser(userData);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    console.log("AuthContext: Initiating logout...");
    try {
      await axiosInstance.post("/api/users/logout");
      console.log("AuthContext: Backend logout successful.");
    } catch (error) {
      console.error(
        "AuthContext: Logout API call failed:",
        error.response?.data || error.message
      );
    } finally {
      setUser(null);
      setIsLoading(false);
      console.log("AuthContext: Frontend user state cleared.");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      console.log("AuthContext: Checking initial auth status via /me...");
      try {
        const response = await axiosInstance.get("/api/users/me");

        if (isMounted) {
          if (response.data) {
            console.log("AuthContext: User is authenticated", response.data);
            setUser(response.data);
          } else {
            console.log("AuthContext: No user data received from /me");
            setUser(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.warn(
            "AuthContext: /me check failed (likely not logged in):",
            error.response?.status
          );
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log("AuthContext: Initial auth check complete.");
        }
      }
    };

    checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // shouldnt happen but just in case
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
