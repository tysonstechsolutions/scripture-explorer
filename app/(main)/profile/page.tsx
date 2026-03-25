"use client";

import { Header } from "@/components/layout/Header";
import { TextSizeSelector } from "@/components/shared/TextSizeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <>
      <Header title="Settings" />
      <main className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-body font-semibold">Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <TextSizeSelector />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
