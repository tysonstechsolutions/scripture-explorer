import type { ApiBibleResponse, BibleChapter, BibleVerse } from "./types";
import { DEFAULT_TRANSLATION } from "./translations";
import { API_BIBLE_BASE_URL, CACHE_DURATIONS } from "./constants";

function getApiKey(): string {
  const apiKey = process.env.API_BIBLE_KEY;
  if (!apiKey) {
    throw new Error("API_BIBLE_KEY environment variable is not configured");
  }
  return apiKey;
}

interface FetchChapterOptions {
  bookId: string;
  chapter: number;
  translationId?: string;
}

interface FetchVerseOptions {
  bookId: string;
  chapter: number;
  verse: number;
  translationId?: string;
}

export async function fetchChapter({
  bookId,
  chapter,
  translationId = DEFAULT_TRANSLATION
}: FetchChapterOptions): Promise<BibleChapter> {
  const chapterId = `${bookId}.${chapter}`;

  const response = await fetch(
    `${API_BIBLE_BASE_URL}/bibles/${translationId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
    {
      headers: {
        "api-key": getApiKey(),
      },
      next: {
        revalidate: CACHE_DURATIONS.CHAPTER,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API.Bible error: ${response.status} ${response.statusText}`);
  }

  const json: ApiBibleResponse<{
    id: string;
    bibleId: string;
    bookId: string;
    number: string;
    reference: string;
    content: string;
    verseCount: number;
  }> = await response.json();

  return {
    id: json.data.id,
    bookId: json.data.bookId,
    number: json.data.number,
    reference: json.data.reference,
    content: json.data.content,
    verseCount: json.data.verseCount,
  };
}

export async function fetchVerse({
  bookId,
  chapter,
  verse,
  translationId = DEFAULT_TRANSLATION
}: FetchVerseOptions): Promise<BibleVerse> {
  const verseId = `${bookId}.${chapter}.${verse}`;

  const response = await fetch(
    `${API_BIBLE_BASE_URL}/bibles/${translationId}/verses/${verseId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false`,
    {
      headers: {
        "api-key": getApiKey(),
      },
      next: {
        revalidate: CACHE_DURATIONS.VERSE,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API.Bible error: ${response.status} ${response.statusText}`);
  }

  const json: ApiBibleResponse<{
    id: string;
    orgId: string;
    bookId: string;
    chapterId: string;
    reference: string;
    content: string;
  }> = await response.json();

  return {
    id: json.data.id,
    orgId: json.data.orgId,
    bookId: json.data.bookId,
    chapterId: json.data.chapterId,
    reference: json.data.reference,
    text: json.data.content.trim(),
  };
}
