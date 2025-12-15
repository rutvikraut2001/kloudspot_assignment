"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, Site, getSiteId, getSiteTimezone } from "@/lib/api";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface SiteState {
  sites: Site[];
  selectedSite: Site | null;
  isLoadingSites: boolean;
}

interface AuthContextType extends AuthState, SiteState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loadSites: () => Promise<void>;
  selectSite: (site: Site) => void;
  getSelectedSiteId: () => string;
  getSelectedSiteTimezone: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Site state
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isLoadingSites, setIsLoadingSites] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedSite = localStorage.getItem("selected_site");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    if (storedSite) {
      try {
        setSelectedSite(JSON.parse(storedSite));
      } catch {
        localStorage.removeItem("selected_site");
      }
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });

      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        setToken(response.token);
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: "No token received" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return { success: false, error: message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("selected_site");
    setToken(null);
    setIsAuthenticated(false);
    setSites([]);
    setSelectedSite(null);
    router.push("/login");
  }, [router]);

  // Load sites
  const loadSites = useCallback(async () => {
    if (!token) return;

    setIsLoadingSites(true);
    try {
      const sitesData = await api.getSites();
      setSites(sitesData);

      // Auto-select first site if none selected
      if (sitesData.length > 0 && !selectedSite) {
        const firstSite = sitesData[0];
        setSelectedSite(firstSite);
        localStorage.setItem("selected_site", JSON.stringify(firstSite));
      }
    } catch (error) {
      console.error("Failed to load sites:", error);
      // If unauthorized, logout
      if (error instanceof Error && error.message.includes("401")) {
        logout();
      }
    } finally {
      setIsLoadingSites(false);
    }
  }, [token, selectedSite, logout]);

  // Select site
  const selectSite = useCallback((site: Site) => {
    setSelectedSite(site);
    localStorage.setItem("selected_site", JSON.stringify(site));
  }, []);

  // Get selected site ID
  const getSelectedSiteId = useCallback(() => {
    return selectedSite ? getSiteId(selectedSite) : "";
  }, [selectedSite]);

  // Get selected site timezone
  const getSelectedSiteTimezone = useCallback(() => {
    return selectedSite ? getSiteTimezone(selectedSite) : "UTC";
  }, [selectedSite]);

  const value: AuthContextType = {
    token,
    isAuthenticated,
    isLoading,
    sites,
    selectedSite,
    isLoadingSites,
    login,
    logout,
    loadSites,
    selectSite,
    getSelectedSiteId,
    getSelectedSiteTimezone,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
