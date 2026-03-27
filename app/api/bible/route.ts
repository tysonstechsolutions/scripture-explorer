import { NextRequest, NextResponse } from "next/server";
import { fetchChapter, fetchVerse } from "@/lib/bible/api";
import { getBookBySlug } from "@/lib/bible/books";
import { DEFAULT_TRANSLATION } from "@/lib/bible/translations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");
  const verse = searchParams.get("verse");
  const translation = searchParams.get("translation") || DEFAULT_TRANSLATION;

  if (!book || !chapter) {
    return NextResponse.json(
      { error: "Missing book or chapter parameter" },
      { status: 400 }
    );
  }

  const bookData = getBookBySlug(book);
  if (!bookData) {
    return NextResponse.json(
      { error: `Unknown book: ${book}` },
      { status: 404 }
    );
  }

  const chapterNum = parseInt(chapter, 10);
  if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > bookData.chapters) {
    return NextResponse.json(
      { error: `Invalid chapter: ${chapter}. ${bookData.name} has ${bookData.chapters} chapters.` },
      { status: 400 }
    );
  }

  try {
    // Fetch specific verse if provided
    if (verse) {
      const verseNum = parseInt(verse, 10);
      if (isNaN(verseNum) || verseNum < 1) {
        return NextResponse.json(
          { error: `Invalid verse: ${verse}` },
          { status: 400 }
        );
      }

      const verseData = await fetchVerse({
        bookId: bookData.id,
        chapter: chapterNum,
        verse: verseNum,
        translationId: translation,
      });

      return NextResponse.json({
        book: bookData,
        verse: {
          ...verseData,
          content: verseData.text,
        },
        translation,
      });
    }

    // Fetch whole chapter
    const data = await fetchChapter({
      bookId: bookData.id,
      chapter: chapterNum,
      translationId: translation,
    });

    return NextResponse.json({
      book: bookData,
      chapter: data,
      translation,
    });
  } catch (error) {
    console.error("Bible API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
