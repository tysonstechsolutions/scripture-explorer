"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useUserData } from "@/contexts/UserDataContext";
import { VerseActions } from "./VerseActions";
import { TopicCallout } from "./TopicCallout";
import { useTopicsForPassage } from "@/lib/hooks/useTopicsForPassage";
import { cn } from "@/lib/utils";

interface ChapterContentProps {
  content: string;
  reference: string;
  bookId: string;
  bookName: string;
  chapter: number;
  translation: string;
}

const HIGHLIGHT_BG: Record<string, string> = {
  yellow: "bg-yellow-200/60 dark:bg-yellow-500/30",
  green: "bg-green-200/60 dark:bg-green-500/30",
  blue: "bg-blue-200/60 dark:bg-blue-500/30",
  pink: "bg-pink-200/60 dark:bg-pink-500/30",
  orange: "bg-orange-200/60 dark:bg-orange-500/30",
};

export const ChapterContent = memo(function ChapterContent({
  content,
  reference,
  bookId,
  bookName,
  chapter,
  translation,
}: ChapterContentProps) {
  const { userData, recordReading, getHighlightsForChapter, getNotesForChapter } = useUserData();
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const relatedTopics = useTopicsForPassage(bookId, chapter);

  // Memoize expensive lookups
  const highlights = useMemo(
    () => getHighlightsForChapter(bookId, chapter),
    [bookId, chapter, getHighlightsForChapter]
  );

  const notes = useMemo(
    () => getNotesForChapter(bookId, chapter),
    [bookId, chapter, getNotesForChapter]
  );

  // Memoize parsed lines
  const lines = useMemo(
    () => content.split("\n").filter((line) => line.trim()),
    [content]
  );

  // Memoize highlight map for O(1) lookups
  const highlightMap = useMemo(() => {
    const map = new Map<number, typeof highlights[0]>();
    highlights.forEach((h) => map.set(h.verse, h));
    return map;
  }, [highlights]);

  // Memoize note counts map
  const noteCountMap = useMemo(() => {
    const map = new Map<number, number>();
    notes.forEach((n) => {
      if (n.verse) {
        map.set(n.verse, (map.get(n.verse) || 0) + 1);
      }
    });
    return map;
  }, [notes]);

  // Memoize bookmark set for O(1) lookups
  const bookmarkSet = useMemo(() => {
    const set = new Set<number>();
    userData.bookmarks.forEach((b) => {
      if (b.bookId === bookId && b.chapter === chapter && b.verse) {
        set.add(b.verse);
      }
    });
    return set;
  }, [userData.bookmarks, bookId, chapter]);

  const handleVerseClick = useCallback((verseNum: number) => {
    setSelectedVerse((prev) => {
      if (prev === verseNum) {
        return null;
      } else {
        // Record reading progress when verse is tapped
        recordReading(bookId, chapter);
        return verseNum;
      }
    });
  }, [bookId, chapter, recordReading]);

  const getHighlightForVerse = useCallback((verse: number) => {
    return highlightMap.get(verse);
  }, [highlightMap]);

  const getNoteCountForVerse = useCallback((verse: number) => {
    return noteCountMap.get(verse) || 0;
  }, [noteCountMap]);

  const isBookmarked = useCallback((verse: number) => {
    return bookmarkSet.has(verse);
  }, [bookmarkSet]);

  return (
    <article className="prose prose-lg max-w-none">
      <div className="text-body-sm text-muted-foreground mb-4">{reference}</div>
      <div className="verse-text space-y-4">
        {lines.map((line, index) => {
          // Extract verse number if present
          const verseMatch = line.match(/^\[(\d+)\]\s*/);
          const verseNum = verseMatch ? parseInt(verseMatch[1], 10) : null;
          const text = verseMatch ? line.replace(/^\[\d+\]\s*/, "") : line;

          const highlight = verseNum ? getHighlightForVerse(verseNum) : null;
          const noteCount = verseNum ? getNoteCountForVerse(verseNum) : 0;
          const bookmarked = verseNum ? isBookmarked(verseNum) : false;

          return (
            <div key={index} className="relative">
              <p
                className={cn(
                  "text-body leading-relaxed cursor-pointer rounded px-1 -mx-1 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  highlight && HIGHLIGHT_BG[highlight.color],
                  selectedVerse === verseNum && "bg-primary/10",
                  !highlight && !selectedVerse && "hover:bg-muted/50"
                )}
                onClick={() => verseNum && handleVerseClick(verseNum)}
                onKeyDown={(e) => {
                  if (verseNum && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleVerseClick(verseNum);
                  }
                }}
                tabIndex={verseNum ? 0 : undefined}
                role={verseNum ? "button" : undefined}
                aria-pressed={selectedVerse === verseNum}
                aria-label={verseNum ? `Verse ${verseNum}${bookmarked ? ", bookmarked" : ""}${noteCount > 0 ? `, ${noteCount} note${noteCount > 1 ? "s" : ""}` : ""}` : undefined}
              >
                {verseNum && (
                  <sup className="verse-number text-leather-500 font-sans mr-1 select-none" aria-hidden="true">
                    {verseNum}
                    {bookmarked && <span className="text-primary ml-0.5">*</span>}
                    {noteCount > 0 && (
                      <span className="text-blue-500 ml-0.5 text-[10px]">{noteCount}</span>
                    )}
                  </sup>
                )}
                {text}
              </p>

              {selectedVerse === verseNum && verseNum && (
                <div className="mt-2 mb-4">
                  <VerseActions
                    bookId={bookId}
                    bookName={bookName}
                    chapter={chapter}
                    verse={verseNum}
                    text={text}
                    translation={translation}
                    onClose={() => setSelectedVerse(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {relatedTopics.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((topic) => (
              <TopicCallout key={topic.slug} topic={topic} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
});
