"use client";

import { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Highlighter,
  MessageSquare,
  Brain,
  Share2,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/contexts/UserDataContext";
import type { HighlightColor } from "@/lib/user/types";
import { cn } from "@/lib/utils";

interface VerseActionsProps {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  onClose: () => void;
}

const HIGHLIGHT_COLORS: { color: HighlightColor; bg: string; label: string }[] = [
  { color: "yellow", bg: "bg-yellow-300", label: "Yellow" },
  { color: "green", bg: "bg-green-300", label: "Green" },
  { color: "blue", bg: "bg-blue-300", label: "Blue" },
  { color: "pink", bg: "bg-pink-300", label: "Pink" },
  { color: "orange", bg: "bg-orange-300", label: "Orange" },
];

export function VerseActions({
  bookId,
  bookName,
  chapter,
  verse,
  text,
  translation,
  onClose,
}: VerseActionsProps) {
  const {
    userData,
    addBookmark,
    removeBookmark,
    isBookmarked,
    addHighlight,
    removeHighlight,
    addNote,
    addMemoryVerse,
  } = useUserData();

  const [mode, setMode] = useState<"actions" | "highlight" | "note" | "memory">("actions");
  const [noteContent, setNoteContent] = useState("");

  const reference = `${bookName} ${chapter}:${verse}`;
  const bookmarked = isBookmarked(bookId, chapter, verse);

  const existingHighlight = userData.highlights.find(
    (h) => h.bookId === bookId && h.chapter === chapter && h.verse === verse
  );

  const existingMemoryVerse = userData.memoryVerses.find(
    (v) => v.bookId === bookId && v.chapter === chapter && v.verse === verse
  );

  const handleBookmark = () => {
    if (bookmarked) {
      const bookmark = userData.bookmarks.find(
        (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
      );
      if (bookmark) removeBookmark(bookmark.id);
    } else {
      addBookmark({ reference, bookId, chapter, verse });
    }
  };

  const handleHighlight = (color: HighlightColor) => {
    if (existingHighlight) {
      removeHighlight(existingHighlight.id);
    }
    addHighlight({ reference, bookId, chapter, verse, color, text });
    setMode("actions");
  };

  const handleRemoveHighlight = () => {
    if (existingHighlight) {
      removeHighlight(existingHighlight.id);
    }
    setMode("actions");
  };

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addNote({ reference, bookId, chapter, verse, content: noteContent });
      setNoteContent("");
      setMode("actions");
    }
  };

  const handleAddMemoryVerse = () => {
    if (!existingMemoryVerse) {
      addMemoryVerse({ reference, bookId, chapter, verse, text, translation });
    }
    setMode("actions");
  };

  const handleShare = async () => {
    const shareText = `"${text}" - ${reference}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled - try clipboard fallback
        try {
          await navigator.clipboard.writeText(shareText);
          toast.success("Verse copied to clipboard");
        } catch {
          toast.error("Unable to copy verse");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Verse copied to clipboard");
      } catch {
        toast.error("Unable to copy verse");
      }
    }
  };

  if (mode === "highlight") {
    return (
      <div
        className="flex flex-wrap items-center gap-2 p-2 bg-card rounded-lg shadow-lg border animate-in fade-in slide-in-from-bottom-2"
        role="group"
        aria-label="Highlight color options"
      >
        <span className="text-sm text-muted-foreground mr-2" id="highlight-label">Pick color:</span>
        {HIGHLIGHT_COLORS.map(({ color, bg, label }) => (
          <button
            key={color}
            onClick={() => handleHighlight(color)}
            className={cn(
              "w-8 h-8 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              bg,
              existingHighlight?.color === color && "ring-2 ring-offset-2 ring-primary"
            )}
            aria-label={`${label} highlight${existingHighlight?.color === color ? " (selected)" : ""}`}
            aria-pressed={existingHighlight?.color === color}
          />
        ))}
        {existingHighlight && (
          <Button variant="ghost" size="sm" onClick={handleRemoveHighlight} aria-label="Remove highlight">
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => setMode("actions")}>
          Cancel
        </Button>
      </div>
    );
  }

  if (mode === "note") {
    return (
      <div className="p-3 bg-card rounded-lg shadow-lg border animate-in fade-in slide-in-from-bottom-2 w-full max-w-sm">
        <div className="text-sm font-medium mb-2">{reference}</div>
        <Textarea
          placeholder="Write your note... (Ctrl+Enter to save)"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleAddNote();
            }
          }}
          className="min-h-[100px] mb-2"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setMode("actions")}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleAddNote} disabled={!noteContent.trim()}>
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1.5 bg-card rounded-lg shadow-lg border animate-in fade-in slide-in-from-bottom-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={cn(bookmarked && "text-primary")}
        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        {bookmarked ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("highlight")}
        className={cn(existingHighlight && "text-primary")}
        aria-label="Highlight verse"
      >
        <Highlighter className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("note")}
        aria-label="Add note"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddMemoryVerse}
        className={cn(existingMemoryVerse && "text-primary")}
        aria-label={existingMemoryVerse ? "Already memorizing" : "Add to memory verses"}
        disabled={!!existingMemoryVerse}
      >
        <Brain className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" onClick={handleShare} aria-label="Share verse">
        <Share2 className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close actions">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
