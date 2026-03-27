"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, BookOpen, History, X, Calendar, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePreferences } from "@/contexts/PreferencesContext";
import { getBookSlug } from "@/lib/bible/books";
import { PILLAR_INFO, type Pillar } from "@/lib/topics/types";

interface VerseResult {
  type: 'verse';
  id: string;
  reference: string;
  bookId: string;
  chapterId: string;
  text: string;
}

interface TopicResult {
  type: 'topic';
  slug: string;
  title: string;
  pillar: string;
  hook: string;
  matchContext?: string;
}

interface ReadingPlanResult {
  type: 'reading-plan';
  id: string;
  name: string;
  description: string;
  duration: number;
}

type SearchResult = VerseResult | TopicResult | ReadingPlanResult;

export default function SearchPage() {
  const { preferences } = usePreferences();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [verseCount, setVerseCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);
  const [planCount, setPlanCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'scripture' | 'topics' | 'plans'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("scripture-recent-searches");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("scripture-recent-searches", JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("scripture-recent-searches");
    }
  };

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setLoading(true);
    setHasSearched(true);
    setError(null);
    setQuery(searchQuery);
    saveRecentSearch(searchQuery);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&translation=${preferences.translation}`
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setResults(data.results || []);
      setTotal(data.total || 0);
      setVerseCount(data.verseCount || 0);
      setTopicCount(data.topicCount || 0);
      setPlanCount(data.planCount || 0);
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to search. Please check your connection and try again.");
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [preferences.translation]);

  const getChapterLink = (result: VerseResult) => {
    // Parse chapterId like "JHN.3" to get book and chapter
    const parts = result.chapterId.split(".");
    const bookId = parts[0];
    const chapter = parts[1];
    const slug = getBookSlug(bookId);
    return `/read/${slug}/${chapter}`;
  };

  const filteredResults = results.filter((result) => {
    if (filter === 'all') return true;
    if (filter === 'scripture') return result.type === 'verse';
    if (filter === 'topics') return result.type === 'topic';
    if (filter === 'plans') return result.type === 'reading-plan';
    return true;
  });

  const highlightQuery = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <Header title="Search Scripture" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search the Bible..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              className="flex-1"
              autoFocus
              aria-label="Search query"
            />
            <Button onClick={() => handleSearch(query)} disabled={loading || query.length < 2} aria-label="Search">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          {query.length > 0 && query.length < 2 && (
            <p className="text-xs text-muted-foreground mt-1">Type at least 2 characters to search</p>
          )}
        </div>

        {/* Recent Searches */}
        {!hasSearched && recentSearches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <History className="h-4 w-4" />
                Recent Searches
              </div>
              <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(search)}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => handleSearch(query)}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && hasSearched && (
          <>
            <div className="text-sm text-muted-foreground mb-4">
              {total > 0 ? (
                <>
                  Found {total} result{total !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
                </>
              ) : (
                <>No results found for &ldquo;{query}&rdquo;</>
              )}
            </div>

            {/* Filter Tabs */}
            {total > 0 && (
              <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All ({total})
                  </TabsTrigger>
                  <TabsTrigger value="scripture" className="flex-1">
                    Scripture ({verseCount})
                  </TabsTrigger>
                  <TabsTrigger value="topics" className="flex-1">
                    Topics ({topicCount})
                  </TabsTrigger>
                  <TabsTrigger value="plans" className="flex-1">
                    Plans ({planCount})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <div className="space-y-3">
              {filteredResults.map((result) => {
                if (result.type === 'verse') {
                  return (
                    <Link key={result.id} href={getChapterLink(result)}>
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="font-medium text-primary mb-1">
                            {result.reference}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {highlightQuery(result.text)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                } else if (result.type === 'topic') {
                  const pillarInfo = PILLAR_INFO[result.pillar as Pillar];
                  return (
                    <Link key={result.slug} href={`/explore/${result.slug}`}>
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-primary">
                              {result.title}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {pillarInfo?.name.split(' ')[0] || result.pillar}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {highlightQuery(result.hook)}
                          </p>
                          {result.matchContext && result.matchContext !== result.hook && (
                            <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2 border-l-2 border-muted pl-2">
                              {highlightQuery(result.matchContext)}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                } else {
                  // Reading plan result
                  return (
                    <Link key={result.id} href="/plans">
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-primary">
                              {result.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {result.duration} days
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {highlightQuery(result.description)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                }
              })}
            </div>
          </>
        )}

        {!loading && !hasSearched && (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Search the Scriptures</h3>
              <p className="text-muted-foreground">
                Enter a word or phrase to search across the entire Bible.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
