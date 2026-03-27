// lib/topics/types.ts

export type Pillar = 'text' | 'prophecy' | 'church' | 'judaism' | 'branches';

export interface ScriptureRef {
  bookId: string;    // Uses existing API.Bible format (e.g., "GEN", "JHN")
  chapter: number;
  verse: number;
  verseEnd?: number; // For ranges like "John 3:16-17"
}

export interface DeepDiveSection {
  id: string;
  title: string;
  content: string; // markdown
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  pillar: Pillar;
  status: 'draft' | 'review' | 'published';
  hook: string;
  overview: string; // markdown
  deepDive: DeepDiveSection[];
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[]; // topic slugs
  timelineEra?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopicIndexEntry {
  slug: string;
  title: string;
  pillar: Pillar;
  status: 'draft' | 'review' | 'published';
  hook: string;
  updatedAt: string;
}

export interface TopicIndex {
  topics: TopicIndexEntry[];
  lastUpdated: string;
}

// Topic user data types
export interface TopicBookmark {
  id: string;
  topicSlug: string;
  createdAt: string;
}

export interface TopicNote {
  id: string;
  topicSlug: string;
  sectionIndex?: number; // Optional: specific deep dive section
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const PILLAR_INFO: Record<Pillar, { name: string; description: string; color: string }> = {
  text: {
    name: 'Text & Transmission',
    description: 'How we got the Bible. Manuscripts, translations, textual variants, reliability evidence.',
    color: 'blue',
  },
  prophecy: {
    name: 'Prophecy & Fulfillment',
    description: 'Predictions examined. Dating debates, fulfilled vs. unfulfilled, the self-fulfilling prophecy question.',
    color: 'purple',
  },
  church: {
    name: 'Church & Empire',
    description: 'How Christianity became an institution. Councils, schisms, Crusades, Reformation, historical atrocities.',
    color: 'amber',
  },
  judaism: {
    name: 'Christianity & Judaism',
    description: 'Jewish roots, the parting of ways, Christian antisemitism, the Holocaust, modern dialogue.',
    color: 'green',
  },
  branches: {
    name: 'Branches & Beliefs',
    description: 'Denominations explained. Why they split, what they disagree on, the landscape today.',
    color: 'red',
  },
};
