"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { TextSize, Theme, Lens } from "@/lib/supabase/types";

interface Preferences {
  textSize: TextSize;
  theme: Theme;
  defaultLens: Lens | null;
  hasCompletedOnboarding: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  setTextSize: (size: TextSize) => void;
  setTheme: (theme: Theme) => void;
  setDefaultLens: (lens: Lens | null) => void;
  completeOnboarding: () => void;
}

const defaultPreferences: Preferences = {
  textSize: "medium",
  theme: "light",
  defaultLens: null,
  hasCompletedOnboarding: false,
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

const STORAGE_KEY = "scripture-explorer-preferences";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch {
        // Invalid JSON, use defaults
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }
  }, [preferences, isLoaded]);

  // Apply text size to document
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute("data-text-size", preferences.textSize);
    }
  }, [preferences.textSize, isLoaded]);

  // Apply theme to document
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.remove("light", "dark");
      if (preferences.theme === "dark" || preferences.theme === "high-contrast") {
        document.documentElement.classList.add("dark");
      }
    }
  }, [preferences.theme, isLoaded]);

  const setTextSize = (textSize: TextSize) => {
    setPreferences((prev) => ({ ...prev, textSize }));
  };

  const setTheme = (theme: Theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const setDefaultLens = (defaultLens: Lens | null) => {
    setPreferences((prev) => ({ ...prev, defaultLens }));
  };

  const completeOnboarding = () => {
    setPreferences((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  };

  // Prevent flash of unstyled content
  if (!isLoaded) {
    return null;
  }

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setTextSize,
        setTheme,
        setDefaultLens,
        completeOnboarding,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
