"use client";

import { ReactNode } from "react";
import { PreferencesProvider } from "@/contexts/PreferencesContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      {children}
    </PreferencesProvider>
  );
}
