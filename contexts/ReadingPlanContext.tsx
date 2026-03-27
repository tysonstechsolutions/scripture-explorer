// contexts/ReadingPlanContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { ChapterReading } from '@/lib/reading-plans/types';

interface ReadingPlanProgress {
  // Chapters read (format: "book-chapter" e.g., "john-1")
  readChapters: string[];
  // Active reading plans
  activePlans: { planSlug: string; startedAt: string }[];
  // Completed reading plans
  completedPlans: { planSlug: string; completedAt: string }[];
}

interface ReadingPlanContextType {
  progress: ReadingPlanProgress;
  // Chapter tracking
  isChapterRead: (book: string, chapter: number) => boolean;
  markChapterRead: (book: string, chapter: number) => void;
  markChapterUnread: (book: string, chapter: number) => void;
  getReadChaptersForPlan: (readings: ChapterReading[]) => string[];
  // Plan tracking
  startPlan: (planSlug: string) => void;
  isPlanStarted: (planSlug: string) => boolean;
  isPlanCompleted: (planSlug: string) => boolean;
  getPlanProgress: (planSlug: string, readings: ChapterReading[]) => {
    completed: number;
    total: number;
    percentage: number;
  };
  markPlanCompleted: (planSlug: string) => void;
  getActivePlans: () => { planSlug: string; startedAt: string }[];
  getCompletedPlans: () => { planSlug: string; completedAt: string }[];
}

const ReadingPlanContext = createContext<ReadingPlanContextType | null>(null);

const STORAGE_KEY = 'scripture-explorer-reading-plan-progress';

const DEFAULT_PROGRESS: ReadingPlanProgress = {
  readChapters: [],
  activePlans: [],
  completedPlans: [],
};

function getChapterKey(book: string, chapter: number): string {
  return `${book.toLowerCase()}-${chapter}`;
}

export function ReadingPlanProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ReadingPlanProgress>(DEFAULT_PROGRESS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress({
          readChapters: parsed.readChapters || [],
          activePlans: parsed.activePlans || [],
          completedPlans: parsed.completedPlans || [],
        });
      } catch {
        // Invalid stored data, use default
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, mounted]);

  const isChapterRead = useCallback(
    (book: string, chapter: number) => {
      return progress.readChapters.includes(getChapterKey(book, chapter));
    },
    [progress.readChapters]
  );

  const markChapterRead = useCallback((book: string, chapter: number) => {
    const key = getChapterKey(book, chapter);
    setProgress(prev => {
      if (prev.readChapters.includes(key)) {
        return prev;
      }
      return {
        ...prev,
        readChapters: [...prev.readChapters, key],
      };
    });
  }, []);

  const markChapterUnread = useCallback((book: string, chapter: number) => {
    const key = getChapterKey(book, chapter);
    setProgress(prev => ({
      ...prev,
      readChapters: prev.readChapters.filter(c => c !== key),
    }));
  }, []);

  const getReadChaptersForPlan = useCallback(
    (readings: ChapterReading[]) => {
      return readings
        .filter(r => progress.readChapters.includes(getChapterKey(r.book, r.chapter)))
        .map(r => getChapterKey(r.book, r.chapter));
    },
    [progress.readChapters]
  );

  const startPlan = useCallback((planSlug: string) => {
    setProgress(prev => {
      if (prev.activePlans.some(p => p.planSlug === planSlug)) {
        return prev;
      }
      return {
        ...prev,
        activePlans: [
          ...prev.activePlans,
          { planSlug, startedAt: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const isPlanStarted = useCallback(
    (planSlug: string) => progress.activePlans.some(p => p.planSlug === planSlug),
    [progress.activePlans]
  );

  const isPlanCompleted = useCallback(
    (planSlug: string) => progress.completedPlans.some(p => p.planSlug === planSlug),
    [progress.completedPlans]
  );

  const getPlanProgress = useCallback(
    (planSlug: string, readings: ChapterReading[]) => {
      const completed = readings.filter(r =>
        progress.readChapters.includes(getChapterKey(r.book, r.chapter))
      ).length;
      const total = readings.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    },
    [progress.readChapters]
  );

  const markPlanCompleted = useCallback((planSlug: string) => {
    setProgress(prev => {
      if (prev.completedPlans.some(p => p.planSlug === planSlug)) {
        return prev;
      }
      return {
        ...prev,
        activePlans: prev.activePlans.filter(p => p.planSlug !== planSlug),
        completedPlans: [
          ...prev.completedPlans,
          { planSlug, completedAt: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const getActivePlans = useCallback(
    () => progress.activePlans,
    [progress.activePlans]
  );

  const getCompletedPlans = useCallback(
    () => progress.completedPlans,
    [progress.completedPlans]
  );

  return (
    <ReadingPlanContext.Provider
      value={{
        progress,
        isChapterRead,
        markChapterRead,
        markChapterUnread,
        getReadChaptersForPlan,
        startPlan,
        isPlanStarted,
        isPlanCompleted,
        getPlanProgress,
        markPlanCompleted,
        getActivePlans,
        getCompletedPlans,
      }}
    >
      {children}
    </ReadingPlanContext.Provider>
  );
}

export function useReadingPlan(): ReadingPlanContextType {
  const context = useContext(ReadingPlanContext);
  if (!context) {
    throw new Error('useReadingPlan must be used within a ReadingPlanProvider');
  }
  return context;
}
