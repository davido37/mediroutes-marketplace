"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "mr-demo-auth";
const FALLBACK_PASSWORD = "MediRoutes2026";

export function useDemoAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const authenticate = useCallback((password: string): boolean => {
    const expected =
      process.env.NEXT_PUBLIC_DEMO_PASSWORD || FALLBACK_PASSWORD;
    if (password === expected) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  return { isAuthenticated, authenticate };
}
