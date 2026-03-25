"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BibleBook } from "@/lib/bible/types";
import { BIBLE_BOOKS } from "@/lib/bible/books";

interface BookChapterNavProps {
  currentBook: BibleBook;
  currentChapter: number;
}

export function BookChapterNav({ currentBook, currentChapter }: BookChapterNavProps) {
  // Calculate prev/next
  let prevHref: string | null = null;
  let nextHref: string | null = null;

  if (currentChapter > 1) {
    prevHref = `/read/${currentBook.name.toLowerCase().replace(/\s+/g, "-")}/${currentChapter - 1}`;
  } else {
    // Go to previous book's last chapter
    const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id);
    if (bookIndex > 0) {
      const prevBook = BIBLE_BOOKS[bookIndex - 1];
      prevHref = `/read/${prevBook.name.toLowerCase().replace(/\s+/g, "-")}/${prevBook.chapters}`;
    }
  }

  if (currentChapter < currentBook.chapters) {
    nextHref = `/read/${currentBook.name.toLowerCase().replace(/\s+/g, "-")}/${currentChapter + 1}`;
  } else {
    // Go to next book's first chapter
    const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id);
    if (bookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[bookIndex + 1];
      nextHref = `/read/${nextBook.name.toLowerCase().replace(/\s+/g, "-")}/1`;
    }
  }

  return (
    <div className="flex items-center justify-between py-4 border-t border-border mt-8">
      {prevHref ? (
        <Link href={prevHref}>
          <Button variant="ghost" className="min-h-tap">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </Button>
        </Link>
      ) : (
        <div />
      )}

      <span className="text-body-sm text-muted-foreground">
        {currentBook.name} {currentChapter}
      </span>

      {nextHref ? (
        <Link href={nextHref}>
          <Button variant="ghost" className="min-h-tap">
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
