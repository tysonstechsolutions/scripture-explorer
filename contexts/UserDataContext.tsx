"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type {
  UserData,
  Bookmark,
  Highlight,
  Note,
  MemoryVerse,
  PrayerRequest,
  ReadingProgress,
  UserReadingPlan,
  HighlightColor,
  TopicBookmark,
  TopicNote,
} from "@/lib/user/types";
import { DEFAULT_USER_DATA } from "@/lib/user/types";
import { ACHIEVEMENTS } from "@/lib/user/achievements";

interface UserDataContextType {
  userData: UserData;
  isLoaded: boolean;

  // Bookmarks
  addBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (bookId: string, chapter: number, verse?: number) => boolean;

  // Highlights
  addHighlight: (highlight: Omit<Highlight, "id" | "createdAt">) => void;
  removeHighlight: (id: string) => void;
  getHighlightsForChapter: (bookId: string, chapter: number) => Highlight[];

  // Notes
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, content: string) => void;
  removeNote: (id: string) => void;
  getNotesForChapter: (bookId: string, chapter: number) => Note[];

  // Memory Verses
  addMemoryVerse: (verse: Omit<MemoryVerse, "id" | "addedAt" | "level" | "streak">) => void;
  removeMemoryVerse: (id: string) => void;
  updateMemoryVerseProgress: (id: string, correct: boolean) => void;
  getMemoryVersesForReview: () => MemoryVerse[];

  // Reading Progress
  recordReading: (bookId: string, chapter: number) => void;
  hasReadToday: () => boolean;
  hasReadChapter: (bookId: string, chapter: number) => boolean;

  // Prayer Requests
  addPrayerRequest: (content: string, isPrivate: boolean) => void;
  markPrayerAnswered: (id: string, answer: string) => void;
  removePrayerRequest: (id: string) => void;

  // Reading Plans
  startReadingPlan: (planId: string) => void;
  completeReadingDay: (planId: string, day: number) => void;
  getActiveReadingPlans: () => UserReadingPlan[];

  // Topic Bookmarks
  addTopicBookmark: (topicSlug: string) => void;
  removeTopicBookmark: (topicSlug: string) => void;
  isTopicBookmarked: (topicSlug: string) => boolean;
  getTopicBookmarks: () => TopicBookmark[];

  // Topic Notes
  addTopicNote: (topicSlug: string, content: string, sectionIndex?: number) => void;
  updateTopicNote: (id: string, content: string) => void;
  removeTopicNote: (id: string) => void;
  getTopicNotes: (topicSlug: string) => TopicNote[];
  getAllTopicNotes: () => TopicNote[];
}

const UserDataContext = createContext<UserDataContextType | null>(null);

const STORAGE_KEY = "scripture-explorer-user-data";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserData({ ...DEFAULT_USER_DATA, ...parsed });
        } catch {
          // Invalid JSON, use defaults
        }
      }
    } catch {
      // localStorage not available (e.g., private browsing mode)
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage with debouncing
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } catch {
        // localStorage quota exceeded or not available
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [userData, isLoaded]);

  // Check and update achievements
  const checkAchievements = useCallback((data: UserData): UserData => {
    const updatedAchievements = ACHIEVEMENTS.map((achievement) => {
      const existing = data.achievements.find((a) => a.id === achievement.id);
      const progress = achievement.checkProgress(data);

      if (existing?.unlockedAt) {
        return existing; // Already unlocked
      }

      if (progress >= (achievement.target || 1)) {
        return {
          ...achievement,
          unlockedAt: new Date().toISOString(),
          progress,
        };
      }

      return { ...achievement, progress };
    });

    return { ...data, achievements: updatedAchievements };
  }, []);

  // Bookmarks
  const addBookmark = useCallback(
    (bookmark: Omit<Bookmark, "id" | "createdAt">) => {
      setUserData((prev) => {
        const newData = {
          ...prev,
          bookmarks: [
            ...prev.bookmarks,
            { ...bookmark, id: generateId(), createdAt: new Date().toISOString() },
          ],
        };
        return checkAchievements(newData);
      });
    },
    [checkAchievements]
  );

  const removeBookmark = useCallback((id: string) => {
    setUserData((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.id !== id),
    }));
  }, []);

  const isBookmarked = useCallback(
    (bookId: string, chapter: number, verse?: number) => {
      return userData.bookmarks.some(
        (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
      );
    },
    [userData.bookmarks]
  );

  // Highlights
  const addHighlight = useCallback(
    (highlight: Omit<Highlight, "id" | "createdAt">) => {
      setUserData((prev) => {
        const newData = {
          ...prev,
          highlights: [
            ...prev.highlights,
            { ...highlight, id: generateId(), createdAt: new Date().toISOString() },
          ],
        };
        return checkAchievements(newData);
      });
    },
    [checkAchievements]
  );

  const removeHighlight = useCallback((id: string) => {
    setUserData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h.id !== id),
    }));
  }, []);

  const getHighlightsForChapter = useCallback(
    (bookId: string, chapter: number) => {
      return userData.highlights.filter((h) => h.bookId === bookId && h.chapter === chapter);
    },
    [userData.highlights]
  );

  // Notes
  const addNote = useCallback(
    (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      setUserData((prev) => {
        const newData = {
          ...prev,
          notes: [...prev.notes, { ...note, id: generateId(), createdAt: now, updatedAt: now }],
        };
        return checkAchievements(newData);
      });
    },
    [checkAchievements]
  );

  const updateNote = useCallback((id: string, content: string) => {
    setUserData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
      ),
    }));
  }, []);

  const removeNote = useCallback((id: string) => {
    setUserData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  }, []);

  const getNotesForChapter = useCallback(
    (bookId: string, chapter: number) => {
      return userData.notes.filter((n) => n.bookId === bookId && n.chapter === chapter);
    },
    [userData.notes]
  );

  // Memory Verses
  const addMemoryVerse = useCallback(
    (verse: Omit<MemoryVerse, "id" | "addedAt" | "level" | "streak">) => {
      setUserData((prev) => {
        const newData = {
          ...prev,
          memoryVerses: [
            ...prev.memoryVerses,
            { ...verse, id: generateId(), addedAt: new Date().toISOString(), level: 0, streak: 0 },
          ],
        };
        return checkAchievements(newData);
      });
    },
    [checkAchievements]
  );

  const removeMemoryVerse = useCallback((id: string) => {
    setUserData((prev) => ({
      ...prev,
      memoryVerses: prev.memoryVerses.filter((v) => v.id !== id),
    }));
  }, []);

  const updateMemoryVerseProgress = useCallback((id: string, correct: boolean) => {
    setUserData((prev) => ({
      ...prev,
      memoryVerses: prev.memoryVerses.map((v) => {
        if (v.id !== id) return v;

        const newLevel = correct ? Math.min(v.level + 1, 5) : Math.max(v.level - 1, 0);
        const newStreak = correct ? v.streak + 1 : 0;

        // Spaced repetition intervals (in days)
        const intervals = [1, 2, 4, 7, 14, 30];
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + intervals[newLevel]);

        return {
          ...v,
          level: newLevel,
          streak: newStreak,
          lastReviewed: new Date().toISOString(),
          nextReview: nextReview.toISOString(),
        };
      }),
    }));
  }, []);

  const getMemoryVersesForReview = useCallback(() => {
    const now = new Date();
    return userData.memoryVerses.filter((v) => {
      if (!v.nextReview) return true;
      return new Date(v.nextReview) <= now;
    });
  }, [userData.memoryVerses]);

  // Reading Progress
  const recordReading = useCallback(
    (bookId: string, chapter: number) => {
      const today = getToday();

      setUserData((prev) => {
        // Check if already recorded
        const existingProgress = prev.readingProgress.find((p) => p.date === today);
        const alreadyRead = existingProgress?.chaptersRead.some(
          (c) => c.bookId === bookId && c.chapter === chapter
        );

        if (alreadyRead) return prev;

        // Update progress
        let newProgress: ReadingProgress[];
        if (existingProgress) {
          newProgress = prev.readingProgress.map((p) =>
            p.date === today
              ? { ...p, chaptersRead: [...p.chaptersRead, { bookId, chapter }] }
              : p
          );
        } else {
          newProgress = [
            ...prev.readingProgress,
            { date: today, chaptersRead: [{ bookId, chapter }], minutesRead: 0 },
          ];
        }

        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const wasActiveYesterday = prev.streak.lastReadDate === yesterdayStr;
        const isAlreadyActiveToday = prev.streak.lastReadDate === today;

        let newStreak = prev.streak;
        if (!isAlreadyActiveToday) {
          const currentStreak = wasActiveYesterday ? prev.streak.currentStreak + 1 : 1;
          newStreak = {
            currentStreak,
            longestStreak: Math.max(currentStreak, prev.streak.longestStreak),
            lastReadDate: today,
            totalChaptersRead: prev.streak.totalChaptersRead + 1,
            totalDaysRead: prev.streak.totalDaysRead + 1,
          };
        } else {
          newStreak = {
            ...prev.streak,
            totalChaptersRead: prev.streak.totalChaptersRead + 1,
          };
        }

        const newData = { ...prev, readingProgress: newProgress, streak: newStreak };
        return checkAchievements(newData);
      });
    },
    [checkAchievements]
  );

  const hasReadToday = useCallback(() => {
    return userData.streak.lastReadDate === getToday();
  }, [userData.streak.lastReadDate]);

  const hasReadChapter = useCallback(
    (bookId: string, chapter: number) => {
      return userData.readingProgress.some((p) =>
        p.chaptersRead.some((c) => c.bookId === bookId && c.chapter === chapter)
      );
    },
    [userData.readingProgress]
  );

  // Prayer Requests
  const addPrayerRequest = useCallback((content: string, isPrivate: boolean) => {
    setUserData((prev) => ({
      ...prev,
      prayerRequests: [
        ...prev.prayerRequests,
        {
          id: generateId(),
          content,
          isPrivate,
          createdAt: new Date().toISOString(),
          prayerCount: 0,
        },
      ],
    }));
  }, []);

  const markPrayerAnswered = useCallback((id: string, answer: string) => {
    setUserData((prev) => ({
      ...prev,
      prayerRequests: prev.prayerRequests.map((p) =>
        p.id === id ? { ...p, answeredAt: new Date().toISOString(), answer } : p
      ),
    }));
  }, []);

  const removePrayerRequest = useCallback((id: string) => {
    setUserData((prev) => ({
      ...prev,
      prayerRequests: prev.prayerRequests.filter((p) => p.id !== id),
    }));
  }, []);

  // Reading Plans
  const startReadingPlan = useCallback((planId: string) => {
    setUserData((prev) => ({
      ...prev,
      activeReadingPlans: [
        ...prev.activeReadingPlans.filter((p) => p.planId !== planId),
        {
          planId,
          startDate: getToday(),
          currentDay: 1,
          completedDays: [],
          isActive: true,
        },
      ],
    }));
  }, []);

  const completeReadingDay = useCallback((planId: string, day: number) => {
    setUserData((prev) => ({
      ...prev,
      activeReadingPlans: prev.activeReadingPlans.map((p) =>
        p.planId === planId
          ? {
              ...p,
              completedDays: [...new Set([...p.completedDays, day])],
              currentDay: Math.max(p.currentDay, day + 1),
            }
          : p
      ),
    }));
  }, []);

  const getActiveReadingPlans = useCallback(() => {
    return userData.activeReadingPlans.filter((p) => p.isActive);
  }, [userData.activeReadingPlans]);

  // Topic Bookmarks
  const addTopicBookmark = useCallback((topicSlug: string) => {
    setUserData((prev) => {
      // Don't add duplicate
      if (prev.topicBookmarks.some((b) => b.topicSlug === topicSlug)) {
        return prev;
      }
      return {
        ...prev,
        topicBookmarks: [
          ...prev.topicBookmarks,
          { id: generateId(), topicSlug, createdAt: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const removeTopicBookmark = useCallback((topicSlug: string) => {
    setUserData((prev) => ({
      ...prev,
      topicBookmarks: prev.topicBookmarks.filter((b) => b.topicSlug !== topicSlug),
    }));
  }, []);

  const isTopicBookmarked = useCallback(
    (topicSlug: string) => {
      return userData.topicBookmarks.some((b) => b.topicSlug === topicSlug);
    },
    [userData.topicBookmarks]
  );

  const getTopicBookmarks = useCallback(() => {
    return userData.topicBookmarks;
  }, [userData.topicBookmarks]);

  // Topic Notes
  const addTopicNote = useCallback((topicSlug: string, content: string, sectionIndex?: number) => {
    const now = new Date().toISOString();
    setUserData((prev) => ({
      ...prev,
      topicNotes: [
        ...prev.topicNotes,
        { id: generateId(), topicSlug, content, sectionIndex, createdAt: now, updatedAt: now },
      ],
    }));
  }, []);

  const updateTopicNote = useCallback((id: string, content: string) => {
    setUserData((prev) => ({
      ...prev,
      topicNotes: prev.topicNotes.map((n) =>
        n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
      ),
    }));
  }, []);

  const removeTopicNote = useCallback((id: string) => {
    setUserData((prev) => ({
      ...prev,
      topicNotes: prev.topicNotes.filter((n) => n.id !== id),
    }));
  }, []);

  const getTopicNotes = useCallback(
    (topicSlug: string) => {
      return userData.topicNotes.filter((n) => n.topicSlug === topicSlug);
    },
    [userData.topicNotes]
  );

  const getAllTopicNotes = useCallback(() => {
    return userData.topicNotes;
  }, [userData.topicNotes]);

  if (!isLoaded) {
    return null;
  }

  return (
    <UserDataContext.Provider
      value={{
        userData,
        isLoaded,
        addBookmark,
        removeBookmark,
        isBookmarked,
        addHighlight,
        removeHighlight,
        getHighlightsForChapter,
        addNote,
        updateNote,
        removeNote,
        getNotesForChapter,
        addMemoryVerse,
        removeMemoryVerse,
        updateMemoryVerseProgress,
        getMemoryVersesForReview,
        recordReading,
        hasReadToday,
        hasReadChapter,
        addPrayerRequest,
        markPrayerAnswered,
        removePrayerRequest,
        startReadingPlan,
        completeReadingDay,
        getActiveReadingPlans,
        addTopicBookmark,
        removeTopicBookmark,
        isTopicBookmarked,
        getTopicBookmarks,
        addTopicNote,
        updateTopicNote,
        removeTopicNote,
        getTopicNotes,
        getAllTopicNotes,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within UserDataProvider");
  }
  return context;
}
