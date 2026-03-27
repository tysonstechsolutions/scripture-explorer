// lib/reading-plans/types.ts

export interface ChapterReading {
  book: string;
  chapter: number;
  title?: string; // Optional custom title like "The Word Became Flesh"
}

export interface ReadingPlan {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  readings: ChapterReading[];
  estimatedDays: number;
  difficulty: ReadingPlanDifficulty;
  category: ReadingPlanCategory;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export type ReadingPlanDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ReadingPlanCategory = 'gospels' | 'epistles' | 'old-testament' | 'prophets' | 'wisdom' | 'whole-bible' | 'topical';

export interface ReadingPlanIndexEntry {
  slug: string;
  title: string;
  description: string;
  readingCount: number;
  estimatedDays: number;
  difficulty: ReadingPlanDifficulty;
  category: ReadingPlanCategory;
  status: 'draft' | 'published';
  updatedAt: string;
}

export const DIFFICULTY_INFO: Record<ReadingPlanDifficulty, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'green' },
  intermediate: { label: 'Intermediate', color: 'amber' },
  advanced: { label: 'Advanced', color: 'red' },
};

export const CATEGORY_INFO: Record<ReadingPlanCategory, { label: string; description: string }> = {
  gospels: { label: 'Gospels', description: 'Matthew, Mark, Luke, John' },
  epistles: { label: 'Epistles', description: 'Letters to the churches' },
  'old-testament': { label: 'Old Testament', description: 'History and Law' },
  prophets: { label: 'Prophets', description: 'Major and Minor Prophets' },
  wisdom: { label: 'Wisdom', description: 'Psalms, Proverbs, Ecclesiastes' },
  'whole-bible': { label: 'Whole Bible', description: 'Cover to cover' },
  topical: { label: 'Topical', description: 'Theme-based readings' },
};
