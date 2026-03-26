export interface BibleTranslation {
  id: string;
  abbreviation: string;
  name: string;
  description: string;
}

// API.Bible IDs - verify these in your API.Bible dashboard
export const TRANSLATIONS: BibleTranslation[] = [
  {
    id: "de4e12af7f28f599-02",
    abbreviation: "KJV",
    name: "King James Version",
    description: "Traditional, classic English",
  },
  {
    id: "06125adad2d5898a-01",
    abbreviation: "NIV",
    name: "New International Version",
    description: "Modern, widely used",
  },
  {
    id: "65eec8e0b60e656b-01",
    abbreviation: "NLT",
    name: "New Living Translation",
    description: "Easy to read, clear",
  },
  {
    id: "01b29f4b342acc35-01",
    abbreviation: "NASB",
    name: "New American Standard Bible",
    description: "Literal, study-focused",
  },
];

export const DEFAULT_TRANSLATION = "de4e12af7f28f599-02"; // KJV

export function getTranslationById(id: string): BibleTranslation | undefined {
  return TRANSLATIONS.find((t) => t.id === id);
}

export function getTranslationByAbbr(abbr: string): BibleTranslation | undefined {
  return TRANSLATIONS.find((t) => t.abbreviation.toLowerCase() === abbr.toLowerCase());
}
