"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function HomePage() {
  const router = useRouter();
  const { preferences } = usePreferences();

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [preferences.hasCompletedOnboarding, router]);

  // Show loading while checking onboarding status
  if (!preferences.hasCompletedOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-body text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-heading font-serif text-leather-700 mb-4">
          Scripture Explorer
        </h1>
        <p className="text-body text-muted-foreground">
          Welcome! The app is being built...
        </p>
      </div>
    </main>
  );
}
