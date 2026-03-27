"use client";

import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { BookOpen, RefreshCw, AlertTriangle } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { ChapterContent } from "./ChapterContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonVerse, SkeletonText } from "@/components/ui/skeleton";
import { getTranslationById, DEFAULT_TRANSLATION } from "@/lib/bible/translations";
import { getStudyNotes } from "@/lib/study/sample-notes";

// Lazy load StudyPanel since it's only shown when user clicks
const StudyPanel = lazy(() => import("./StudyPanel").then((m) => ({ default: m.StudyPanel })));

interface ChapterReaderProps {
  bookSlug: string;
  bookId: string;
  bookName: string;
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
  bookName,
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
  const [error, setError] = useState<string | null>(null);
  const [showStudy, setShowStudy] = useState(false);

  const studyNotes = getStudyNotes(bookId, chapter);

  const fetchChapter = useCallback(async (translationId: string) => {
    setIsLoading(true);
    setError(null);
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
    } catch (err) {
      console.error("Error fetching chapter:", err);
      setError("Unable to load this translation. Please try again.");
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

      {error ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" />
            <p className="text-sm text-destructive mb-3">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchChapter(preferences.translation)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="py-4" role="status" aria-label="Loading chapter content">
          <SkeletonVerse />
        </div>
      ) : (
        <ChapterContent
          content={data.content}
          reference={data.reference}
          bookId={bookId}
          bookName={bookName}
          chapter={chapter}
          translation={currentTranslation}
        />
      )}

      {showStudy && studyNotes && (
        <Suspense fallback={<div className="mt-4 p-4 border rounded-lg"><SkeletonText lines={4} /></div>}>
          <StudyPanel notes={studyNotes} />
        </Suspense>
      )}
    </div>
  );
}
