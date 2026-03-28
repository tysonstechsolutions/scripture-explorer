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
    glossaryTerms: ['BCE', 'CE', 'Mesopotamia', 'Sumerians', 'Ziggurat', 'Cuneiform', 'Torah'],
    timeline: [
      { date: 'Beginning', event: 'God creates the heavens and earth', approximate: true },
      { date: '~3500 BCE', event: 'Sumerian civilization emerges (~5,500 years ago)', approximate: true },
      { date: '~2600 BCE', event: 'Great Pyramids built (~4,600 years ago)', approximate: true },
      { date: '~2100 BCE', event: 'City of Ur at its height (~4,100 years ago)', approximate: true },
      { date: '~2000 BCE', event: "Abraham's journey begins (~4,000 years ago)", approximate: true },
      { date: '~1750 BCE', event: 'Code of Hammurabi written (~3,750 years ago)', approximate: true },
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
    glossaryTerms: [
      'Patriarch', 'Matriarch', 'Covenant', 'Canaan', 'Birthright',
      'Blessing', 'Suzerain', 'Hyksos', 'Teraphim', 'Nuzi', 'Mari',
      'Semitic', 'Twelve Tribes', 'Providence', 'Supplanter'
    ],
    timeline: [
      { date: '~2000 BCE', event: "Abraham's journey begins (~4,000 years ago)", approximate: true },
      { date: '~1900 BCE', event: 'Isaac born to Abraham and Sarah (~3,900 years ago)', approximate: true },
      { date: '~1850 BCE', event: 'Jacob and Esau born to Isaac (~3,850 years ago)', approximate: true },
      { date: '~1800 BCE', event: 'Joseph sold into slavery in Egypt (~3,800 years ago)', approximate: true },
      { date: '~1700 BCE', event: "Jacob's family moves to Egypt (~3,700 years ago)", approximate: true },
      { date: '~1650-1550 BCE', event: 'Hyksos period in Egypt (~3,600 years ago)', approximate: true },
    ],
    deepDives: [
      'archaeology-and-the-patriarchs',
      'ancient-covenants',
      'hyksos-and-israel',
      'genesis-22',
      'jacob-and-esau',
      'twelve-tribes'
    ],
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
