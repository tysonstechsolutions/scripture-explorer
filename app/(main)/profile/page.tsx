"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { TextSizeSelector } from "@/components/shared/TextSizeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <>
      <Header title="Settings" />
      <main className="p-4 pb-24 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-body font-semibold">Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <TextSizeSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body font-semibold">Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-muted-foreground mb-4">
              Scripture Explorer is free to use. Your donations help keep it that way.
            </p>
            <Link href="/donate">
              <Button className="w-full min-h-tap text-body" variant="outline">
                <Heart className="h-5 w-5 mr-2" />
                Make a Donation
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body font-semibold">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-muted-foreground">
              Scripture Explorer is an interactive Bible study platform designed to make
              exploring the Bible accessible and engaging for everyone.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Version 1.0.0
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
