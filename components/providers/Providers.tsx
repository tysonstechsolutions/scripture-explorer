"use client";

import { ReactNode } from "react";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { UserDataProvider } from "@/contexts/UserDataContext";
import { ReadingPlanProvider } from "@/contexts/ReadingPlanContext";
import { ServiceWorkerProvider } from "./ServiceWorkerProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ServiceWorkerProvider>
      <PreferencesProvider>
        <UserDataProvider>
          <ReadingPlanProvider>
            {children}
            <Toaster position="bottom-center" />
          </ReadingPlanProvider>
        </UserDataProvider>
      </PreferencesProvider>
    </ServiceWorkerProvider>
  );
}
