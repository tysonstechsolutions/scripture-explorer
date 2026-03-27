"use client";

import { WifiOff, BookOpen, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <WifiOff className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">You&apos;re Offline</h1>
          <p className="text-muted-foreground mb-6">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry &ndash;
            some features are still available offline:
          </p>

          <div className="space-y-3 text-left mb-6">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Previously Read Chapters</p>
                <p className="text-sm text-muted-foreground">
                  Chapters you&apos;ve read before are cached and available offline.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Your Notes &amp; Highlights</p>
                <p className="text-sm text-muted-foreground">
                  All your personal notes and highlights are stored locally.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Bookmarks &amp; Reading Plans</p>
                <p className="text-sm text-muted-foreground">
                  Your reading progress is saved and will sync when you&apos;re back online.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
