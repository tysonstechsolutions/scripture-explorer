export interface BibleBook {
  id: string;
  name: string;
  nameLong: string;
  abbreviation: string;
  chapters: number;
}

export interface BibleVerse {
  id: string;
  orgId: string;
  bookId: string;
  chapterId: string;
  reference: string;
  text: string;
}

export interface BibleChapter {
  id: string;
  bookId: string;
  number: string;
  reference: string;
  content: string;
  verseCount: number;
}

export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

// API.Bible response types
export interface ApiBibleResponse<T> {
  data: T;
  meta?: {
    fums: string;
    fumsId: string;
    fumsJsInclude: string;
    fumsJs: string;
    fumsNoScript: string;
  };
}
