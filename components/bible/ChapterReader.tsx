"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { ChapterContent } from "./ChapterContent";
import { StudyPanel } from "./StudyPanel";
import { Button } from "@/components/ui/button";
import { getTranslationById, DEFAULT_TRANSLATION } from "@/lib/bible/translations";
import { getStudyNotes } from "@/lib/study/sample-notes";

interface ChapterReaderProps {
  bookSlug: string;
  bookId: string;
  chapter: number;
  initialContent: string;
  initialReference: string;
  initialTranslation?: string;
}

interface ChapterData {
  content: string;
  reference: string;
}

export function ChapterReader({
  bookSlug,
  bookId,
  chapter,
  initialContent,
  initialReference,
  initialTranslation = DEFAULT_TRANSLATION,
}: ChapterReaderProps) {
  const { preferences } = usePreferences();
  const [data, setData] = useState<ChapterData>({
    content: initialContent,
    reference: initialReference,
  });
  const [currentTranslation, setCurrentTranslation] = useState(initialTranslation);
  const [isLoading, setIsLoading] = useState(false);
  const [showStudy, setShowStudy] = useState(false);

  const studyNotes = getStudyNotes(bookId, chapter);

  const fetchChapter = useCallback(async (translationId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/bible?book=${bookSlug}&chapter=${chapter}&translation=${translationId}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const json = await response.json();
      setData({
        content: json.chapter.content,
        reference: json.chapter.reference,
      });
      setCurrentTranslation(translationId);
    } catch (error) {
      console.error("Error fetching chapter:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookSlug, chapter]);

  useEffect(() => {
    if (preferences.translation !== currentTranslation) {
      fetchChapter(preferences.translation);
    }
  }, [preferences.translation, currentTranslation, fetchChapter]);

  const translation = getTranslationById(currentTranslation);

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        {translation && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {translation.abbreviation}
            </span>
            <span className="text-xs text-muted-foreground/60">
              {translation.name}
            </span>
          </div>
        )}

        {studyNotes && (
          <Button
            variant={showStudy ? "default" : "outline"}
            size="sm"
            onClick={() => setShowStudy(!showStudy)}
            className="flex items-center gap-1.5"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Study Notes</span>
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      )}

      <ChapterContent content={data.content} reference={data.reference} />

      {showStudy && studyNotes && (
        <StudyPanel notes={studyNotes} />
      )}
    </div>
  );
}
