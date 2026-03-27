"use client";

import { useMemo, useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useUserData } from "@/contexts/UserDataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Highlighter, BookOpen, Trash2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { getBookSlug } from "@/lib/bible/books";
import { cn } from "@/lib/utils";
import { PILLAR_INFO, type Pillar, type TopicIndexEntry } from "@/lib/topics/types";

const HIGHLIGHT_BG: Record<string, string> = {
  yellow: "bg-yellow-200 dark:bg-yellow-500/40",
  green: "bg-green-200 dark:bg-green-500/40",
  blue: "bg-blue-200 dark:bg-blue-500/40",
  pink: "bg-pink-200 dark:bg-pink-500/40",
  orange: "bg-orange-200 dark:bg-orange-500/40",
};

export default function BookmarksPage() {
  const { userData, removeBookmark, removeHighlight, getTopicBookmarks, removeTopicBookmark } = useUserData();
  const [topicDetails, setTopicDetails] = useState<Record<string, TopicIndexEntry>>({});

  const sortedBookmarks = useMemo(
    () => [...userData.bookmarks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [userData.bookmarks]
  );

  const sortedHighlights = useMemo(
    () => [...userData.highlights].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [userData.highlights]
  );

  const topicBookmarks = useMemo(
    () => getTopicBookmarks().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [getTopicBookmarks]
  );

  // Fetch topic details for bookmarked topics
  useEffect(() => {
    async function fetchTopicDetails() {
      const details: Record<string, TopicIndexEntry> = {};
      for (const bookmark of topicBookmarks) {
        try {
          const res = await fetch(`/api/topics/${bookmark.topicSlug}`);
          if (res.ok) {
            const data = await res.json();
            details[bookmark.topicSlug] = {
              slug: data.topic.slug,
              title: data.topic.title,
              pillar: data.topic.pillar,
              status: data.topic.status,
              hook: data.topic.hook,
              updatedAt: data.topic.updatedAt,
            };
          }
        } catch (error) {
          console.error('Failed to fetch topic:', error);
        }
      }
      setTopicDetails(details);
    }

    if (topicBookmarks.length > 0) {
      fetchTopicDetails();
    }
  }, [topicBookmarks]);

  return (
    <>
      <Header title="Bookmarks & Highlights" showBack />
      <main className="p-4 max-w-2xl mx-auto">
        <Tabs defaultValue="bookmarks">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="bookmarks" className="flex items-center gap-1 text-xs sm:text-sm">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Bookmarks</span> ({sortedBookmarks.length})
            </TabsTrigger>
            <TabsTrigger value="highlights" className="flex items-center gap-1 text-xs sm:text-sm">
              <Highlighter className="h-4 w-4" />
              <span className="hidden sm:inline">Highlights</span> ({sortedHighlights.length})
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center gap-1 text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Topics</span> ({topicBookmarks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks">
            {sortedBookmarks.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Bookmarks Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Tap on any verse while reading and click the bookmark icon to save it.
                  </p>
                  <Link href="/read/john/3">
                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Reading
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {sortedBookmarks.map((bookmark, index) => (
                  <Card key={bookmark.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/read/${getBookSlug(bookmark.bookId)}/${bookmark.chapter}`}
                          className="flex-1"
                        >
                          <div className="font-medium text-primary hover:underline">
                            {bookmark.reference}
                          </div>
                          {bookmark.note && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {bookmark.note}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(bookmark.createdAt).toLocaleDateString()}
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-touch"
                          aria-label="Delete bookmark"
                          onClick={() => {
                            if (confirm("Remove this bookmark?")) {
                              removeBookmark(bookmark.id);
                            }
                          }}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="highlights">
            {sortedHighlights.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="p-8 text-center">
                  <Highlighter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Highlights Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Tap on any verse while reading and click the highlighter to mark important passages.
                  </p>
                  <Link href="/read/psalms/23">
                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Reading
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {sortedHighlights.map((highlight, index) => (
                  <Card key={highlight.id} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/read/${getBookSlug(highlight.bookId)}/${highlight.chapter}`}
                          className="flex-1"
                        >
                          <div className="font-medium text-primary hover:underline mb-2">
                            {highlight.reference}
                          </div>
                          <p
                            className={cn(
                              "text-sm px-2 py-1 rounded",
                              HIGHLIGHT_BG[highlight.color]
                            )}
                          >
                            &ldquo;{highlight.text}&rdquo;
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(highlight.createdAt).toLocaleDateString()}
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-touch"
                          aria-label="Delete highlight"
                          onClick={() => {
                            if (confirm("Remove this highlight?")) {
                              removeHighlight(highlight.id);
                            }
                          }}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="topics">
            {topicBookmarks.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="p-8 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Topic Bookmarks Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse topics and click the bookmark icon to save them for later.
                  </p>
                  <Link href="/explore">
                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore Topics
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {topicBookmarks.map((bookmark, index) => {
                  const topic = topicDetails[bookmark.topicSlug];
                  return (
                    <Card key={bookmark.topicSlug} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/explore/${bookmark.topicSlug}`}
                            className="flex-1"
                          >
                            <div className="font-medium text-primary hover:underline">
                              {topic?.title || bookmark.topicSlug.replace(/-/g, ' ')}
                            </div>
                            {topic && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {PILLAR_INFO[topic.pillar as Pillar]?.name.split(' ')[0] || topic.pillar}
                              </Badge>
                            )}
                            {topic?.hook && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {topic.hook}
                              </p>
                            )}
                            <div className="text-xs text-muted-foreground mt-2">
                              {new Date(bookmark.createdAt).toLocaleDateString()}
                            </div>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon-touch"
                            aria-label="Remove bookmark"
                            onClick={() => {
                              if (confirm("Remove this bookmark?")) {
                                removeTopicBookmark(bookmark.topicSlug);
                              }
                            }}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
