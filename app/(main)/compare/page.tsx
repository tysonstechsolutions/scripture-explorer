"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRANSLATIONS } from "@/lib/bible/translations";
import { BIBLE_BOOKS, getBookBySlug } from "@/lib/bible/books";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Search, Loader2, BookOpen } from "lucide-react";

interface TranslationResult {
  translationId: string;
  translationName: string;
  translationAbbr: string;
  content: string;
  error?: string;
}

export default function ComparePage() {
  const [book, setBook] = useState("john");
  const [chapter, setChapter] = useState("3");
  const [verse, setVerse] = useState("16");
  const [results, setResults] = useState<TranslationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const selectedBook = getBookBySlug(book);

  const fetchComparison = useCallback(async () => {
    if (!book || !chapter || !verse) return;

    setLoading(true);
    setHasSearched(true);

    const fetchResults = await Promise.all(
      TRANSLATIONS.map(async (translation) => {
        try {
          const response = await fetch(
            `/api/bible?book=${book}&chapter=${chapter}&verse=${verse}&translation=${translation.id}`
          );

          if (!response.ok) {
            return {
              translationId: translation.id,
              translationName: translation.name,
              translationAbbr: translation.abbreviation,
              content: "",
              error: "Not available",
            };
          }

          const data = await response.json();
          return {
            translationId: translation.id,
            translationName: translation.name,
            translationAbbr: translation.abbreviation,
            content: data.verse?.content || data.chapter?.content || "",
          };
        } catch {
          return {
            translationId: translation.id,
            translationName: translation.name,
            translationAbbr: translation.abbreviation,
            content: "",
            error: "Failed to load",
          };
        }
      })
    );

    setResults(fetchResults);
    setLoading(false);
  }, [book, chapter, verse]);

  // Load initial comparison on mount
  useEffect(() => {
    fetchComparison();
  }, []);

  const handleSearch = () => {
    fetchComparison();
  };

  return (
    <>
      <Header title="Compare Translations" showBack />
      <main className="p-4 max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <Label htmlFor="book" className="text-xs">
                  Book
                </Label>
                <Select value={book} onValueChange={(val) => val && setBook(val)}>
                  <SelectTrigger id="book">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {BIBLE_BOOKS.map((b) => (
                      <SelectItem
                        key={b.id}
                        value={b.name.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="chapter" className="text-xs">
                  Chapter
                </Label>
                <Input
                  id="chapter"
                  type="number"
                  min="1"
                  max={selectedBook?.chapters || 150}
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="verse" className="text-xs">
                  Verse
                </Label>
                <Input
                  id="verse"
                  type="number"
                  min="1"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Compare
            </Button>
          </CardContent>
        </Card>

        {loading && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading translations...
              </div>
            </div>
            {TRANSLATIONS.map((t) => (
              <SkeletonCard key={t.id} />
            ))}
          </div>
        )}

        {!loading && hasSearched && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold">
                {selectedBook?.name} {chapter}:{verse}
              </h2>
              <p className="text-sm text-muted-foreground">
                Comparing {TRANSLATIONS.length} translations
              </p>
            </div>

            {results.map((result) => (
              <Card key={result.translationId}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-primary">
                      {result.translationAbbr}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {result.translationName}
                    </span>
                  </div>
                  {result.error ? (
                    <p className="text-sm text-muted-foreground italic">
                      {result.error}
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed">
                      {result.content || "Content not available"}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !hasSearched && (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Compare Translations</h3>
              <p className="text-muted-foreground">
                Select a verse above and click Compare to see how different
                translations render the same passage.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
