"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChapterLoadErrorProps {
  bookName: string;
  chapter: number;
  bookSlug: string;
}

export function ChapterLoadError({ bookName, chapter, bookSlug }: ChapterLoadErrorProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Unable to Load {bookName} {chapter}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        There was a problem loading this chapter. This could be a temporary issue with the Bible API. Please try again.
      </p>
      <button
        onClick={() => router.refresh()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-leather-600 text-white hover:bg-leather-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
