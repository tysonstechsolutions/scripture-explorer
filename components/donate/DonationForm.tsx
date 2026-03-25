"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DONATION_AMOUNTS } from "@/lib/stripe/client";

export function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDonate = async () => {
    if (!selectedAmount) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedAmount }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout");
      }
    } catch (error) {
      console.error("Donation error:", error);
      alert("Failed to process donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-heading font-serif">Support Scripture Explorer</CardTitle>
        <CardDescription className="text-body">
          Your donation helps keep this resource free and accessible to everyone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {DONATION_AMOUNTS.map((amount) => (
            <Button
              key={amount.value}
              variant={selectedAmount === amount.value ? "default" : "outline"}
              className="min-h-tap text-body"
              onClick={() => setSelectedAmount(amount.value)}
            >
              {amount.label}
            </Button>
          ))}
        </div>

        <Button
          className="w-full min-h-tap text-body"
          size="lg"
          disabled={!selectedAmount || isLoading}
          onClick={handleDonate}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Heart className="h-5 w-5 mr-2" />
              Donate {selectedAmount ? DONATION_AMOUNTS.find((a) => a.value === selectedAmount)?.label : ""}
            </>
          )}
        </Button>

        <p className="text-body-sm text-center text-muted-foreground">
          Secure payment powered by Stripe. No account required.
        </p>
      </CardContent>
    </Card>
  );
}
