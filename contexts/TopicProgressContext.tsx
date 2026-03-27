// contexts/TopicProgressContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface ReadHistoryEntry {
  slug: string;
  readAt: string;
}

interface TopicProgress {
  readTopics: string[];
  readHistory: ReadHistoryEntry[];
  activePaths: { pathSlug: string; startedAt: string }[];
  completedPaths: { pathSlug: string; completedAt: string }[];
}

interface TopicProgressContextType {
  progress: TopicProgress;
  isRead: (slug: string) => boolean;
  markAsRead: (slug: string) => void;
  markAsUnread: (slug: string) => void;
  getRecentlyRead: (limit?: number) => ReadHistoryEntry[];
  // Path methods
  startPath: (pathSlug: string) => void;
  isPathStarted: (pathSlug: string) => boolean;
  isPathCompleted: (pathSlug: string, topicSlugs: string[]) => boolean;
  getPathProgress: (pathSlug: string, topicSlugs: string[]) => {
    completed: number;
    total: number;
    percentage: number;
  };
  getActivePaths: () => { pathSlug: string; startedAt: string }[];
  getCompletedPaths: () => { pathSlug: string; completedAt: string }[];
  markPathCompleted: (pathSlug: string) => void;
}

const TopicProgressContext = createContext<TopicProgressContextType | null>(null);

const PROGRESS_STORAGE_KEY = 'scripture-explorer-topic-progress';

const DEFAULT_PROGRESS: TopicProgress = {
  readTopics: [],
  readHistory: [],
  activePaths: [],
  completedPaths: [],
};

export function TopicProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<TopicProgress>(DEFAULT_PROGRESS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress({
          readTopics: parsed.readTopics || [],
          readHistory: parsed.readHistory || [],
          activePaths: parsed.activePaths || [],
          completedPaths: parsed.completedPaths || [],
        });
      } catch {
        // Invalid stored data, use default
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, mounted]);

  const isRead = useCallback(
    (slug: string) => progress.readTopics.includes(slug),
    [progress.readTopics]
  );

  const markAsRead = useCallback((slug: string) => {
    setProgress(prev => {
      const now = new Date().toISOString();

      const readTopics = prev.readTopics.includes(slug)
        ? prev.readTopics
        : [...prev.readTopics, slug];

      const filteredHistory = prev.readHistory.filter(h => h.slug !== slug);
      const readHistory = [{ slug, readAt: now }, ...filteredHistory].slice(0, 50);

      return { ...prev, readTopics, readHistory };
    });
  }, []);

  const markAsUnread = useCallback((slug: string) => {
    setProgress(prev => ({
      ...prev,
      readTopics: prev.readTopics.filter(s => s !== slug),
      readHistory: prev.readHistory.filter(h => h.slug !== slug),
    }));
  }, []);

  const getRecentlyRead = useCallback(
    (limit: number = 10) => {
      return progress.readHistory.slice(0, limit);
    },
    [progress.readHistory]
  );

  // Path methods
  const startPath = useCallback((pathSlug: string) => {
    setProgress(prev => {
      if (prev.activePaths.some(p => p.pathSlug === pathSlug)) {
        return prev;
      }
      return {
        ...prev,
        activePaths: [
          ...prev.activePaths,
          { pathSlug, startedAt: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const isPathStarted = useCallback(
    (pathSlug: string) => progress.activePaths.some(p => p.pathSlug === pathSlug),
    [progress.activePaths]
  );

  const isPathCompleted = useCallback(
    (pathSlug: string, topicSlugs: string[]) => {
      if (topicSlugs.length === 0) return false;
      return topicSlugs.every(slug => progress.readTopics.includes(slug));
    },
    [progress.readTopics]
  );

  const getPathProgress = useCallback(
    (pathSlug: string, topicSlugs: string[]) => {
      const completed = topicSlugs.filter(slug =>
        progress.readTopics.includes(slug)
      ).length;
      const total = topicSlugs.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    },
    [progress.readTopics]
  );

  const getActivePaths = useCallback(
    () => progress.activePaths,
    [progress.activePaths]
  );

  const getCompletedPaths = useCallback(
    () => progress.completedPaths,
    [progress.completedPaths]
  );

  const markPathCompleted = useCallback((pathSlug: string) => {
    setProgress(prev => {
      if (prev.completedPaths.some(p => p.pathSlug === pathSlug)) {
        return prev;
      }
      return {
        ...prev,
        activePaths: prev.activePaths.filter(p => p.pathSlug !== pathSlug),
        completedPaths: [
          ...prev.completedPaths,
          { pathSlug, completedAt: new Date().toISOString() },
        ],
      };
    });
  }, []);

  return (
    <TopicProgressContext.Provider
      value={{
        progress,
        isRead,
        markAsRead,
        markAsUnread,
        getRecentlyRead,
        startPath,
        isPathStarted,
        isPathCompleted,
        getPathProgress,
        getActivePaths,
        getCompletedPaths,
        markPathCompleted,
      }}
    >
      {children}
    </TopicProgressContext.Provider>
  );
}

export function useTopicProgress(): TopicProgressContextType {
  const context = useContext(TopicProgressContext);
  if (!context) {
    throw new Error('useTopicProgress must be used within a TopicProgressProvider');
  }
  return context;
}
