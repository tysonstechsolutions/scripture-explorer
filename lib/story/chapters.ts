// lib/story/chapters.ts

import type { StoryChapter } from './types';

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: '01',
    slug: 'the-world-before-israel',
    title: 'The World Before Israel',
    order: 1,
    era: 'creation',
    content: '', // Loaded from markdown
    timeline: [
      { date: '~3500 BCE', event: 'Sumerian civilization emerges', approximate: true },
      { date: '~2600 BCE', event: 'Great Pyramids built', approximate: true },
      { date: '~2100 BCE', event: 'Ur at its height', approximate: true },
      { date: '~2000-1800 BCE', event: "Abraham's journey", approximate: true },
      { date: '~1750 BCE', event: 'Code of Hammurabi', approximate: true },
    ],
    deepDives: [
      'ancient-creation-myths',
      'ur-of-the-chaldees',
      'egypt-in-the-bible',
      'archaeology-and-the-patriarchs',
    ],
    nextChapter: 'the-patriarchs',
  },
  {
    id: '02',
    slug: 'the-patriarchs',
    title: 'The Patriarchs',
    order: 2,
    era: 'patriarchs',
    content: '',
    timeline: [
      { date: '~2000 BCE', event: 'Abraham enters Canaan', approximate: true },
      { date: '~1900 BCE', event: 'Isaac born', approximate: true },
      { date: '~1850 BCE', event: 'Jacob and Esau', approximate: true },
      { date: '~1800 BCE', event: 'Joseph in Egypt', approximate: true },
    ],
    deepDives: ['covenant-theology', 'patriarchal-society', 'hyksos-period'],
    prevChapter: 'the-world-before-israel',
    nextChapter: 'exodus-and-liberation',
  },
  // More chapters to be added...
];

export function getChapterBySlug(slug: string): StoryChapter | undefined {
  return STORY_CHAPTERS.find(c => c.slug === slug);
}

export function getChaptersByEra(era: string): StoryChapter[] {
  return STORY_CHAPTERS.filter(c => c.era === era);
}

export function getAllChapters(): StoryChapter[] {
  return STORY_CHAPTERS.sort((a, b) => a.order - b.order);
}
