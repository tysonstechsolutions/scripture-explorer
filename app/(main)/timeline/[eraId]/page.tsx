import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { getEraById, ERAS } from "@/lib/timeline/eras";
import { getBookBySlug } from "@/lib/bible/books";
import { EraTopics } from "@/components/timeline/EraTopics";

interface PageProps {
  params: Promise<{
    eraId: string;
  }>;
}

export default async function EraDetailPage({ params }: PageProps) {
  const { eraId } = await params;
  const era = getEraById(eraId);

  if (!era) {
    notFound();
  }

  const prevEra = era.order > 1 ? ERAS.find((e) => e.order === era.order - 1) : null;
  const nextEra = era.order < 14 ? ERAS.find((e) => e.order === era.order + 1) : null;

  return (
    <>
      <Header title={era.name} showBack />
      <main className="p-4 pb-24 max-w-2xl mx-auto">
        {/* Era Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-4 h-4 rounded-full ${era.color}`} />
          <div>
            <p className="text-body-sm text-muted-foreground">{era.dateRange}</p>
          </div>
        </div>

        {/* TL;DR */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-body font-semibold">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body">{era.tldr}</p>
          </CardContent>
        </Card>

        {/* Bible Books */}
        {era.bibleBooks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-body font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Books from this Era
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {era.bibleBooks.map((bookName) => {
                  // Try to match the book name - handles "1 Samuel", "Song of Solomon", etc.
                  const slug = bookName.toLowerCase().replace(/\s+/g, "-");
                  const book = getBookBySlug(slug) || getBookBySlug(bookName);
                  const href = book
                    ? `/read/${book.name.toLowerCase().replace(/\s+/g, "-")}/1`
                    : null;

                  return href ? (
                    <Link key={bookName} href={href}>
                      <Button variant="outline" size="sm" className="text-body-sm">
                        {bookName}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      key={bookName}
                      variant="outline"
                      size="sm"
                      className="text-body-sm"
                      disabled
                    >
                      {bookName}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Topics */}
        <EraTopics eraId={eraId} />

        {/* AI Content Placeholder */}
        <Card className="mb-6 border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-body text-muted-foreground">
              Detailed content about key figures, events, and connections will be generated here.
            </p>
            <p className="text-body-sm text-muted-foreground mt-2">
              Coming soon with AI-powered content generation.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between py-4 border-t border-border">
          {prevEra ? (
            <Link href={`/timeline/${prevEra.id}`}>
              <Button variant="ghost" className="min-h-tap">
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">{prevEra.name}</span>
                <span className="sm:hidden">Previous</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          <span className="text-body-sm text-muted-foreground">
            {era.order} of 14
          </span>

          {nextEra ? (
            <Link href={`/timeline/${nextEra.id}`}>
              <Button variant="ghost" className="min-h-tap">
                <span className="hidden sm:inline">{nextEra.name}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { eraId } = await params;
  const era = getEraById(eraId);

  return {
    title: era ? `${era.name} - Scripture Explorer` : "Timeline - Scripture Explorer",
  };
}
