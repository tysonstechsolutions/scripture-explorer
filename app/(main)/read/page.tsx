import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { BIBLE_BOOKS } from "@/lib/bible/books";

export default function ReadPage() {
  const oldTestament = BIBLE_BOOKS.slice(0, 39);
  const newTestament = BIBLE_BOOKS.slice(39);

  return (
    <>
      <Header title="Read" />
      <main className="p-4 pb-24">
        <section className="mb-8">
          <h2 className="text-body font-semibold mb-4">Old Testament</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {oldTestament.map((book) => (
              <Link
                key={book.id}
                href={`/read/${book.name.toLowerCase().replace(/\s+/g, "-")}/1`}
                className="tap-target"
              >
                <Card className="hover:bg-parchment-200 transition-colors h-full">
                  <CardContent className="p-3">
                    <div className="text-body-sm font-medium truncate">{book.name}</div>
                    <div className="text-xs text-muted-foreground">{book.chapters} ch</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-body font-semibold mb-4">New Testament</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {newTestament.map((book) => (
              <Link
                key={book.id}
                href={`/read/${book.name.toLowerCase().replace(/\s+/g, "-")}/1`}
                className="tap-target"
              >
                <Card className="hover:bg-parchment-200 transition-colors h-full">
                  <CardContent className="p-3">
                    <div className="text-body-sm font-medium truncate">{book.name}</div>
                    <div className="text-xs text-muted-foreground">{book.chapters} ch</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
