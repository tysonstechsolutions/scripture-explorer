// API.Bible base URL
export const API_BIBLE_BASE_URL = "https://api.scripture.api.bible/v1";

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: "scripture-explorer-user-data",
  PREFERENCES: "scripture-explorer-preferences",
  RECENT_SEARCHES: "scripture-recent-searches",
  DAILY_KNOWLEDGE: "daily-knowledge-date",
  HELPER_COLLAPSED: "scripture-helper-collapsed",
  HELPER_DISMISSED: "scripture-helper-dismissed",
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  CHAPTER: 60 * 60 * 24 * 30, // 30 days
  VERSE: 60 * 60 * 24 * 30, // 30 days
} as const;
