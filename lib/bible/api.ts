import type { ApiBibleResponse, BibleChapter } from "./types";
import { DEFAULT_TRANSLATION } from "./translations";

const API_BASE = "https://api.scripture.api.bible/v1";

interface FetchChapterOptions {
  bookId: string;
  chapter: number;
  translationId?: string;
}

export async function fetchChapter({
  bookId,
  chapter,
  translationId = DEFAULT_TRANSLATION
}: FetchChapterOptions): Promise<BibleChapter> {
  const chapterId = `${bookId}.${chapter}`;

  const response = await fetch(
    `${API_BASE}/bibles/${translationId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
    {
      headers: {
        "api-key": process.env.API_BIBLE_KEY!,
      },
      next: {
        revalidate: 60 * 60 * 24 * 30, // Cache for 30 days
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
