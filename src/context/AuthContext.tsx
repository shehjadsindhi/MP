"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  savedPersona?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  setSavedPersona: (persona: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Login failed", "error");
        return { success: false, error: data.error };
      }
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, "success");
      return { success: true };
    } catch (err: any) {
      showToast("Network error during login", "error");
      return { success: false, error: err.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Registration failed", "error");
        return { success: false, error: data.error };
      }
      setUser(data.user);
      showToast("Account created successfully! Welcome to Galaxy AI Hub.", "success");
      return { success: true };
    } catch (err: any) {
      showToast("Network error during registration", "error");
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      showToast("Logged out successfully.", "info");
    } catch (err) {
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setUser(result.user);
        showToast("Profile details updated successfully!", "success");
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const setSavedPersona = async (persona: string) => {
    if (user) {
      await updateProfile({ savedPersona: persona });
    }
    showToast(`Galaxy AI Persona personalized for: ${persona}`, "ai");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        setSavedPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
