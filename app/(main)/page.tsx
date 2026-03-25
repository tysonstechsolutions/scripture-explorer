"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  const router = useRouter();
  const { preferences } = usePreferences();

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [preferences.hasCompletedOnboarding, router]);

  if (!preferences.hasCompletedOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-body text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <>
      <Header title="Scripture Explorer" />
      <main className="p-4">
        <div className="text-center py-12">
          <h2 className="text-heading font-serif text-leather-700 mb-4">
            Welcome!
          </h2>
          <p className="text-body text-muted-foreground max-w-md mx-auto">
            Explore the Bible from Genesis to modern day. Use the navigation below to get started.
          </p>
        </div>
      </main>
    </>
  );
}
