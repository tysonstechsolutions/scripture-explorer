// lib/story/types.ts

export interface StoryChapter {
  id: string;
  slug: string;
  title: string;
  order: number;
  era: string;
  content: string;
  timeline?: TimelineEvent[];
  deepDives?: string[];
  glossaryTerms?: string[]; // Terms to explain in the chapter legend
  nextChapter?: string;
  prevChapter?: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  approximate?: boolean;
}

export interface DeepDive {
  id: string;
  slug: string;
  title: string;
  content: string;
  relatedChapters: string[];
  relatedScriptures: string[];
}

export interface ScriptureReference {
  reference: string;
  text?: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse?: number;
}

// Eras for timeline navigation
export const STORY_ERAS = [
  { id: 'creation', name: 'Creation & Primeval', range: 'Beginning - ~2000 BCE' },
  { id: 'patriarchs', name: 'The Patriarchs', range: '~2000 - 1500 BCE' },
  { id: 'exodus', name: 'Exodus & Conquest', range: '~1500 - 1200 BCE' },
  { id: 'judges', name: 'The Judges', range: '~1200 - 1050 BCE' },
  { id: 'united-kingdom', name: 'United Kingdom', range: '~1050 - 930 BCE' },
  { id: 'divided-kingdom', name: 'Divided Kingdom', range: '930 - 586 BCE' },
  { id: 'exile', name: 'Exile & Return', range: '586 - 400 BCE' },
  { id: 'second-temple', name: 'Second Temple Period', range: '400 BCE - 70 CE' },
  { id: 'jesus', name: 'Life of Jesus', range: '~4 BCE - 30 CE' },
  { id: 'early-church', name: 'Early Church', range: '30 - 100 CE' },
  { id: 'formation', name: 'Canon & Creeds', range: '100 - 400 CE' },
  { id: 'branches', name: 'The Great Divisions', range: '400 CE - Present' },
] as const;

export type StoryEra = typeof STORY_ERAS[number]['id'];
