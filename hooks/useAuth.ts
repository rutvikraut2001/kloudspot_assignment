"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiService } from "@/services/api";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.login(email, password);

          if (response.success || response.token) {
            const token = response.token;
            const user = response.user || { id: response.userId || "1", email };

            // Store in localStorage
            if (typeof window !== "undefined") {
              localStorage.setItem("auth_token", token);
              localStorage.setItem("user", JSON.stringify(user));
            }

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || "Login failed");
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        apiService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
