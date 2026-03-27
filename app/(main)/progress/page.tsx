// app/(main)/progress/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Circle, BookOpen, Lightbulb, Route } from 'lucide-react';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import type { TopicIndexEntry, Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';
import type { PathIndexEntry } from '@/lib/paths/types';
import { DIFFICULTY_INFO } from '@/lib/paths/types';

function getSuggestedTopics(
  readTopics: TopicIndexEntry[],
  unreadTopics: TopicIndexEntry[],
  limit: number = 3
): TopicIndexEntry[] {
  if (unreadTopics.length === 0) return [];
  if (readTopics.length === 0) {
    // No reading history - suggest one from each pillar
    const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];
    const suggestions: TopicIndexEntry[] = [];
    for (const pillar of pillars) {
      const topic = unreadTopics.find(t => t.pillar === pillar);
      if (topic) suggestions.push(topic);
      if (suggestions.length >= limit) break;
    }
    return suggestions.length > 0 ? suggestions : unreadTopics.slice(0, limit);
  }

  // Count reads per pillar
  const pillarCounts: Record<string, number> = {};
  for (const topic of readTopics) {
    pillarCounts[topic.pillar] = (pillarCounts[topic.pillar] || 0) + 1;
  }

  // Prioritize pillars user has engaged with
  const engagedPillars = Object.keys(pillarCounts).sort(
    (a, b) => pillarCounts[b] - pillarCounts[a]
  );

  const suggestions: TopicIndexEntry[] = [];

  // First, suggest from pillars user has read
  for (const pillar of engagedPillars) {
    const pillarUnread = unreadTopics.filter(t => t.pillar === pillar);
    for (const topic of pillarUnread) {
      if (suggestions.length >= limit) break;
      suggestions.push(topic);
    }
    if (suggestions.length >= limit) break;
  }

  // Fill with other unread topics
  for (const topic of unreadTopics) {
    if (suggestions.length >= limit) break;
    if (!suggestions.find(s => s.slug === topic.slug)) {
      suggestions.push(topic);
    }
  }

  return suggestions;
}

export default function ProgressPage() {
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);
  const [paths, setPaths] = useState<PathIndexEntry[]>([]);
  const [pathTopics, setPathTopics] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const { isRead, markAsUnread, progress, getActivePaths, getCompletedPaths } = useTopicProgress();

  useEffect(() => {
    async function loadData() {
      try {
        // Load topics
        const topicsRes = await fetch('/api/topics?status=published');
        if (topicsRes.ok) {
          const data = await topicsRes.json();
          setTopics(data.topics);
        }

        // Load paths
        const pathsRes = await fetch('/api/paths?status=published');
        if (pathsRes.ok) {
          const data = await pathsRes.json();
          setPaths(data.paths);

          // Fetch topics for each path
          const topicsMap: Record<string, string[]> = {};
          for (const path of data.paths) {
            const pathRes = await fetch(`/api/paths/${path.slug}`);
            if (pathRes.ok) {
              const pathData = await pathRes.json();
              topicsMap[path.slug] = pathData.path.topics;
            }
          }
          setPathTopics(topicsMap);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const readTopics = topics.filter(t => isRead(t.slug));
  const unreadTopics = topics.filter(t => !isRead(t.slug));
  const suggestedTopics = getSuggestedTopics(readTopics, unreadTopics, 3);
  const readCount = readTopics.length;
  const totalCount = topics.length;
  const percentage = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;

  // Calculate path progress
  const getPathProgress = (pathSlug: string): { read: number; total: number; percentage: number } => {
    const topics = pathTopics[pathSlug] || [];
    const readCount = topics.filter(slug => progress.readTopics.includes(slug)).length;
    const total = topics.length;
    return {
      read: readCount,
      total,
      percentage: total > 0 ? Math.round((readCount / total) * 100) : 0,
    };
  };

  const activePaths = getActivePaths();
  const completedPaths = getCompletedPaths();
  const activePathSlugs = activePaths.map(p => p.pathSlug);
  const completedPathSlugs = completedPaths.map(p => p.pathSlug);
  const inProgressPaths = paths.filter(p =>
    activePathSlugs.includes(p.slug) && !completedPathSlugs.includes(p.slug)
  );
  const completedPathsList = paths.filter(p => completedPathSlugs.includes(p.slug));
  const notStartedPaths = paths.filter(p =>
    !activePathSlugs.includes(p.slug) && !completedPathSlugs.includes(p.slug)
  );

  return (
    <div className="pb-20">
      <Header title="Progress" />

      <div className="p-4 space-y-6">
        {/* Overview Stats */}
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                {readCount} of {totalCount} topics read
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Paths Progress */}
        {paths.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Route className="h-4 w-4" />
                Learning Paths
              </h2>
              <Link href="/paths">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

            {/* In Progress Paths */}
            {inProgressPaths.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">In Progress</p>
                <div className="space-y-2">
                  {inProgressPaths.map(path => {
                    const prog = getPathProgress(path.slug);
                    return (
                      <Link key={path.slug} href={`/paths/${path.slug}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/30">
                          <CardContent className="py-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">{path.title}</p>
                              <Badge variant="outline" className="text-xs">
                                {DIFFICULTY_INFO[path.difficulty].label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${prog.percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {prog.read}/{prog.total}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Paths */}
            {completedPathsList.length > 0 && (
              <div>
                <p className="text-sm text-green-600 dark:text-green-500 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed ({completedPathsList.length})
                </p>
                <div className="space-y-2">
                  {completedPathsList.map(path => (
                    <Link key={path.slug} href={`/paths/${path.slug}`}>
                      <Card className="hover:shadow-sm transition-shadow cursor-pointer bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                        <CardContent className="flex items-center justify-between py-3">
                          <p className="font-medium">{path.title}</p>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Not Started Paths */}
            {notStartedPaths.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Available ({notStartedPaths.length})
                </p>
                <div className="space-y-2">
                  {notStartedPaths.slice(0, 2).map(path => (
                    <Link key={path.slug} href={`/paths/${path.slug}`}>
                      <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium">{path.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {DIFFICULTY_INFO[path.difficulty].label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {path.topicCount} topics
                              </span>
                            </div>
                          </div>
                          <Route className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <>
            {/* Suggested Topics */}
            {suggestedTopics.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <Lightbulb className="h-4 w-4" />
                  Suggested Next
                </h2>
                <div className="space-y-2">
                  {suggestedTopics.map(topic => (
                    <Link key={topic.slug} href={`/explore/${topic.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer border-amber-200 dark:border-amber-800">
                        <CardContent className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium">{topic.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{topic.hook}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {PILLAR_INFO[topic.pillar].name}
                            </Badge>
                          </div>
                          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Unread Topics */}
            {unreadTopics.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Circle className="h-4 w-4" />
                  To Read ({unreadTopics.length})
                </h2>
                <div className="space-y-2">
                  {unreadTopics.map(topic => (
                    <Link key={topic.slug} href={`/explore/${topic.slug}`}>
                      <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium">{topic.title}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {PILLAR_INFO[topic.pillar].name}
                            </Badge>
                          </div>
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Read Topics */}
            {readTopics.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed ({readTopics.length})
                </h2>
                <div className="space-y-2">
                  {readTopics.map(topic => (
                    <Card key={topic.slug}>
                      <CardContent className="flex items-center justify-between py-3">
                        <Link href={`/explore/${topic.slug}`} className="flex-1">
                          <p className="font-medium">{topic.title}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {PILLAR_INFO[topic.pillar].name}
                          </Badge>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsUnread(topic.slug)}
                        >
                          Mark unread
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {totalCount === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No published topics yet.</p>
                <Link href="/explore">
                  <Button variant="link">Go to Explore</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
