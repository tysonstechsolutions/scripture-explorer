"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useUserData } from "@/contexts/UserDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Check, X, RotateCcw, BookOpen, Award, Trash2 } from "lucide-react";
import Link from "next/link";
import { getBookSlug } from "@/lib/bible/books";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "practice";

export default function MemoryVersesPage() {
  const { userData, getMemoryVersesForReview, updateMemoryVerseProgress, removeMemoryVerse } = useUserData();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceVerses, setPracticeVerses] = useState<typeof userData.memoryVerses>([]);

  const versesForReview = getMemoryVersesForReview();

  const startPractice = () => {
    setPracticeVerses(versesForReview.length > 0 ? versesForReview : userData.memoryVerses);
    setCurrentIndex(0);
    setShowAnswer(false);
    setViewMode("practice");
  };

  const handleAnswer = (correct: boolean) => {
    const verse = practiceVerses[currentIndex];
    updateMemoryVerseProgress(verse.id, correct);

    if (currentIndex < practiceVerses.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setViewMode("list");
    }
  };

  const getLevelLabel = (level: number) => {
    const labels = ["New", "Learning", "Familiar", "Known", "Mastered", "Expert"];
    return labels[level] || "New";
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-gray-200 text-gray-700",
      "bg-yellow-200 text-yellow-800",
      "bg-blue-200 text-blue-800",
      "bg-green-200 text-green-800",
      "bg-purple-200 text-purple-800",
      "bg-amber-400 text-amber-900",
    ];
    return colors[level] || colors[0];
  };

  if (viewMode === "practice" && practiceVerses.length > 0) {
    const verse = practiceVerses[currentIndex];

    return (
      <>
        <Header title="Practice" showBack />
        <main className="p-4 max-w-2xl mx-auto">
          <div className="text-center text-sm text-muted-foreground mb-4">
            {currentIndex + 1} of {practiceVerses.length}
          </div>

          <Card className="min-h-[300px] flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col justify-center">
              {!showAnswer ? (
                <div className="text-center">
                  <div className="text-xl font-semibold mb-4">{verse.reference}</div>
                  <p className="text-muted-foreground mb-6">
                    Can you recite this verse from memory?
                  </p>
                  <Button size="lg" onClick={() => setShowAnswer(true)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reveal Answer
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">{verse.reference}</div>
                  <p className="text-lg leading-relaxed mb-6">&ldquo;{verse.text}&rdquo;</p>
                  <div className="text-sm text-muted-foreground mb-6">
                    Did you remember it correctly?
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleAnswer(false)}
                      className="flex-1 max-w-[150px]"
                    >
                      <X className="h-5 w-5 mr-2 text-destructive" />
                      No
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleAnswer(true)}
                      className="flex-1 max-w-[150px]"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Yes!
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setViewMode("list")}>
              Exit Practice
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Memory Verses" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        {userData.memoryVerses.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Memory Verses Yet</h3>
              <p className="text-muted-foreground mb-4">
                Tap on any verse while reading and select the brain icon to add it to your memory verses.
              </p>
              <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                Memorizing Scripture renews your mind and helps God&apos;s Word guide your daily life.
              </p>
              <Link href="/read/psalms/23">
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start with Psalm 23
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {versesForReview.length > 0 && (
              <Card className="mb-6 bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {versesForReview.length} verse{versesForReview.length !== 1 ? "s" : ""} ready for review
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Practice now to strengthen your memory
                      </div>
                    </div>
                    <Button onClick={startPractice}>
                      <Brain className="h-4 w-4 mr-2" />
                      Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {userData.memoryVerses.length} verse{userData.memoryVerses.length !== 1 ? "s" : ""}
              </div>
              {versesForReview.length === 0 && userData.memoryVerses.length > 0 && (
                <Button variant="outline" size="sm" onClick={startPractice}>
                  Practice All
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {userData.memoryVerses.map((verse, index) => (
                <Card key={verse.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link
                        href={`/read/${getBookSlug(verse.bookId)}/${verse.chapter}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {verse.reference}
                      </Link>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            getLevelColor(verse.level)
                          )}
                        >
                          {getLevelLabel(verse.level)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-touch"
                          aria-label="Remove memory verse"
                          onClick={() => {
                            if (confirm("Remove this memory verse?")) {
                              removeMemoryVerse(verse.id);
                            }
                          }}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      &ldquo;{verse.text}&rdquo;
                    </p>
                    {verse.streak > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                        <Award className="h-3 w-3" />
                        {verse.streak} correct in a row
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
