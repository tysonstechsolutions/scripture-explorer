// lib/paths/types.ts

import type { Pillar } from '@/lib/topics/types';

export type PathDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  pillar?: Pillar;
  difficulty: PathDifficulty;
  estimatedMinutes: number;
  topics: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface PathIndexEntry {
  slug: string;
  title: string;
  description: string;
  pillar?: Pillar;
  difficulty: PathDifficulty;
  estimatedMinutes: number;
  topicCount: number;
  status: 'draft' | 'published';
  updatedAt: string;
}

export interface PathIndex {
  paths: PathIndexEntry[];
  lastUpdated: string;
}

export const DIFFICULTY_INFO: Record<PathDifficulty, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'green' },
  intermediate: { label: 'Intermediate', color: 'amber' },
  advanced: { label: 'Advanced', color: 'red' },
};
