import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ChapterContent } from "@/components/bible/ChapterContent";
import { BookChapterNav } from "@/components/bible/BookChapterNav";
import { getBookBySlug } from "@/lib/bible/books";
import { fetchChapter } from "@/lib/bible/api";

interface PageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export default async function ChapterPage({ params }: PageProps) {
  const { book: bookSlug, chapter: chapterStr } = await params;

  const book = getBookBySlug(bookSlug);
  if (!book) {
    notFound();
  }

  const chapter = parseInt(chapterStr, 10);
  if (isNaN(chapter) || chapter < 1 || chapter > book.chapters) {
    notFound();
  }

  const chapterData = await fetchChapter({
    bookId: book.id,
    chapter,
  });

  return (
    <>
      <Header title={`${book.name} ${chapter}`} showBack />
      <main className="p-4 max-w-2xl mx-auto">
        <ChapterContent
          content={chapterData.content}
          reference={chapterData.reference}
        />
        <BookChapterNav currentBook={book} currentChapter={chapter} />
      </main>
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { book: bookSlug, chapter } = await params;
  const book = getBookBySlug(bookSlug);

  return {
    title: book ? `${book.name} ${chapter} - Scripture Explorer` : "Scripture Explorer",
  };
}
