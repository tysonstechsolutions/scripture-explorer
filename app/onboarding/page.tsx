"use client";

import { useRouter } from "next/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";
import { TextSizeSelector } from "@/components/shared/TextSizeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = usePreferences();

  const handleContinue = () => {
    completeOnboarding();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-parchment-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-heading font-serif text-leather-700">
            Welcome to Scripture Explorer
          </CardTitle>
          <CardDescription className="text-body">
            Let&apos;s set up your reading experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextSizeSelector />

          <div className="pt-4">
            <Button
              onClick={handleContinue}
              className="w-full min-h-tap text-body"
              size="lg"
            >
              Continue
            </Button>
          </div>

          <p className="text-body-sm text-center text-muted-foreground">
            You can change this anytime in Settings
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
