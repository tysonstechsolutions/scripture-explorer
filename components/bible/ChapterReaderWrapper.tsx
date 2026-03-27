"use client";

import { ChapterReader } from "./ChapterReader";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

interface ChapterReaderWrapperProps {
  bookSlug: string;
  bookId: string;
  bookName: string;
  chapter: number;
  initialContent: string;
  initialReference: string;
  initialTranslation?: string;
}

export function ChapterReaderWrapper(props: ChapterReaderWrapperProps) {
  return (
    <ErrorBoundary>
      <ChapterReader {...props} />
    </ErrorBoundary>
  );
}
