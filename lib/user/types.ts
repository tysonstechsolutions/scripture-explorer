// User data types for personal Bible study features

export interface Bookmark {
  id: string;
  reference: string;      // e.g., "John 3:16"
  bookId: string;
  chapter: number;
  verse?: number;
  createdAt: string;
  note?: string;
}

export interface Highlight {
  id: string;
  reference: string;
  bookId: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  text: string;           // The highlighted text
  createdAt: string;
}

export type HighlightColor = "yellow" | "green" | "blue" | "pink" | "orange";

export interface Note {
  id: string;
  reference: string;      // Can be book, chapter, or verse level
  bookId: string;
  chapter: number;
  verse?: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryVerse {
  id: string;
  reference: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  addedAt: string;
  lastReviewed?: string;
  nextReview?: string;
  level: number;          // Spaced repetition level (0-5)
  streak: number;
}

export interface ReadingProgress {
  date: string;           // YYYY-MM-DD
  chaptersRead: {
    bookId: string;
    chapter: number;
  }[];
  minutesRead: number;
}

export interface ReadingStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string;
  totalChaptersRead: number;
  totalDaysRead: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface PrayerRequest {
  id: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  answeredAt?: string;
  answer?: string;
  prayerCount: number;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number;       // days
  readings: {
    day: number;
    passages: {
      bookId: string;
      chapter: number;
    }[];
  }[];
}

export interface UserReadingPlan {
  planId: string;
  startDate: string;
  currentDay: number;
  completedDays: number[];
  isActive: boolean;
}

// Topic-related user data
export interface TopicBookmark {
  id: string;
  topicSlug: string;
  createdAt: string;
}

export interface TopicNote {
  id: string;
  topicSlug: string;
  sectionIndex?: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  bookmarks: Bookmark[];
  highlights: Highlight[];
  notes: Note[];
  memoryVerses: MemoryVerse[];
  readingProgress: ReadingProgress[];
  streak: ReadingStreak;
  achievements: Achievement[];
  prayerRequests: PrayerRequest[];
  activeReadingPlans: UserReadingPlan[];
  topicBookmarks: TopicBookmark[];
  topicNotes: TopicNote[];
}

export const DEFAULT_USER_DATA: UserData = {
  bookmarks: [],
  highlights: [],
  notes: [],
  memoryVerses: [],
  readingProgress: [],
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: "",
    totalChaptersRead: 0,
    totalDaysRead: 0,
  },
  achievements: [],
  prayerRequests: [],
  activeReadingPlans: [],
  topicBookmarks: [],
  topicNotes: [],
};
