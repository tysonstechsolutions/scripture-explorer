"use client";

import { Header } from "@/components/layout/Header";
import { usePreferences } from "@/contexts/PreferencesContext";
import { TRANSLATIONS } from "@/lib/bible/translations";
import type { TextSize, Theme } from "@/lib/supabase/types";
import { BookOpen, Sun, Moon, Type, Globe, RotateCcw } from "lucide-react";

const textSizeOptions: { value: TextSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra Large" },
];

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export default function SettingsPage() {
  const {
    preferences,
    setTextSize,
    setTheme,
    setTranslation,
  } = usePreferences();

  return (
    <>
      <Header title="Settings" />
      <main className="p-4 pb-24 max-w-lg mx-auto space-y-6">
        {/* Bible Translation */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-leather-600" />
            <h2 className="font-semibold text-foreground">Bible Translation</h2>
          </div>
          <div className="space-y-2">
            {TRANSLATIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTranslation(t.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  preferences.translation === t.id
                    ? "border-leather-600 bg-leather-50 dark:bg-leather-900/20"
                    : "border-border hover:border-leather-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-foreground">{t.abbreviation}</span>
                    <span className="text-muted-foreground ml-2 text-sm">{t.name}</span>
                  </div>
                  {preferences.translation === t.id && (
                    <div className="h-2 w-2 rounded-full bg-leather-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Text Size */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Type className="h-5 w-5 text-leather-600" />
            <h2 className="font-semibold text-foreground">Text Size</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {textSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTextSize(option.value)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  preferences.textSize === option.value
                    ? "border-leather-600 bg-leather-50 dark:bg-leather-900/20 text-leather-600"
                    : "border-border hover:border-leather-300 text-foreground"
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
            <p
              className="text-foreground"
              style={{
                fontSize:
                  preferences.textSize === "small"
                    ? "0.875rem"
                    : preferences.textSize === "medium"
                    ? "1rem"
                    : preferences.textSize === "large"
                    ? "1.125rem"
                    : "1.25rem",
              }}
            >
              Preview: In the beginning God created the heaven and the earth.
            </p>
          </div>
        </section>

        {/* Theme */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sun className="h-5 w-5 text-leather-600" />
            <h2 className="font-semibold text-foreground">Theme</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                    preferences.theme === option.value
                      ? "border-leather-600 bg-leather-50 dark:bg-leather-900/20 text-leather-600"
                      : "border-border hover:border-leather-300 text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* About */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-leather-600" />
            <h2 className="font-semibold text-foreground">About</h2>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground">
              Scripture Explorer is an interactive Bible study platform for exploring Scripture from Genesis to modern day. Featuring AI-powered study tools, multiple perspectives, and comprehensive timelines.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Version 0.1.0</p>
          </div>
        </section>
      </main>
    </>
  );
}
