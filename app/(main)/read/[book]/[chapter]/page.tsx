import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ChapterReaderWrapper } from "@/components/bible/ChapterReaderWrapper";
import { BookChapterNav } from "@/components/bible/BookChapterNav";
import { getBookBySlug } from "@/lib/bible/books";
import { fetchChapter } from "@/lib/bible/api";
import { DEFAULT_TRANSLATION } from "@/lib/bible/translations";

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
        <ChapterReaderWrapper
          bookSlug={bookSlug}
          bookId={book.id}
          bookName={book.name}
          chapter={chapter}
          initialContent={chapterData.content}
          initialReference={chapterData.reference}
          initialTranslation={DEFAULT_TRANSLATION}
        />
        <BookChapterNav currentBook={book} currentChapter={chapter} />
      </main>
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { book: bookSlug, chapter } = await params;
  const book = getBookBySlug(bookSlug);

  if (!book) {
    return { title: "Scripture Explorer" };
  }

  const title = `${book.name} ${chapter} - Scripture Explorer`;
  const description = `Read ${book.name} chapter ${chapter} from the Bible. Study Scripture with interactive features including highlighting, notes, and bookmarks.`;

  return {
    title,
    description,
    openGraph: {
      title: `${book.name} ${chapter}`,
      description,
      type: "article",
      siteName: "Scripture Explorer",
    },
    twitter: {
      card: "summary",
      title: `${book.name} ${chapter}`,
      description,
    },
  };
}
