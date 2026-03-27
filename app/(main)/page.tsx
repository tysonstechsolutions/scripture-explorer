// app/(main)/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { useAdmin } from '@/contexts/AdminContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import {
  BookOpen,
  ScrollText,
  Church,
  Star,
  GitBranch,
  Settings,
  Compass,
  Book,
  Clock,
  ChevronRight,
  Route,
} from 'lucide-react';
import type { Pillar, TopicIndexEntry } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';
import { PathCard } from '@/components/paths/PathCard';
import type { PathIndexEntry } from '@/lib/paths/types';

const pillarIcons: Record<Pillar, React.ReactNode> = {
  text: <ScrollText className="h-8 w-8" />,
  prophecy: <Star className="h-8 w-8" />,
  church: <Church className="h-8 w-8" />,
  judaism: <BookOpen className="h-8 w-8" />,
  branches: <GitBranch className="h-8 w-8" />,
};

const pillarColors: Record<Pillar, string> = {
  text: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
  prophecy: 'border-purple-500 bg-purple-50 dark:bg-purple-950',
  church: 'border-amber-500 bg-amber-50 dark:bg-amber-950',
  judaism: 'border-green-500 bg-green-50 dark:bg-green-950',
  branches: 'border-red-500 bg-red-50 dark:bg-red-950',
};

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];

export default function HomePage() {
  const { isAdmin } = useAdmin();
  const { preferences } = usePreferences();
  const { getRecentlyRead, progress, getActivePaths } = useTopicProgress();
  const router = useRouter();
  const [recentTopics, setRecentTopics] = useState<TopicIndexEntry[]>([]);
  const [paths, setPaths] = useState<PathIndexEntry[]>([]);
  const [pathTopics, setPathTopics] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.replace('/onboarding');
    }
  }, [preferences.hasCompletedOnboarding, router]);

  // Fetch recent topic details
  useEffect(() => {
    async function fetchRecentTopics() {
      const recent = getRecentlyRead(3);
      if (recent.length === 0) return;

      try {
        const topicDetails: TopicIndexEntry[] = [];
        for (const entry of recent) {
          const res = await fetch(`/api/topics/${entry.slug}`);
          if (res.ok) {
            const data = await res.json();
            topicDetails.push({
              slug: data.topic.slug,
              title: data.topic.title,
              pillar: data.topic.pillar,
              status: data.topic.status,
              hook: data.topic.hook,
              updatedAt: data.topic.updatedAt,
            });
          }
        }
        setRecentTopics(topicDetails);
      } catch (error) {
        console.error('Failed to fetch recent topics:', error);
      }
    }

    if (preferences.hasCompletedOnboarding) {
      fetchRecentTopics();
    }
  }, [getRecentlyRead, preferences.hasCompletedOnboarding]);

  // Fetch learning paths
  useEffect(() => {
    async function fetchPaths() {
      try {
        const res = await fetch('/api/paths?status=published');
        if (res.ok) {
          const data = await res.json();
          setPaths(data.paths.slice(0, 3)); // Show up to 3 paths

          // Fetch topics for each path
          const topicsMap: Record<string, string[]> = {};
          for (const path of data.paths.slice(0, 3)) {
            const pathRes = await fetch(`/api/paths/${path.slug}`);
            if (pathRes.ok) {
              const pathData = await pathRes.json();
              topicsMap[path.slug] = pathData.path.topics;
            }
          }
          setPathTopics(topicsMap);
        }
      } catch (error) {
        console.error('Failed to fetch paths:', error);
      }
    }

    if (preferences.hasCompletedOnboarding) {
      fetchPaths();
    }
  }, [preferences.hasCompletedOnboarding]);

  if (!preferences.hasCompletedOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-body text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <div className="pb-20">
      <Header
        title="Scripture Explorer"
        rightAction={
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        }
      />

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-4">
          <h2 className="text-xl font-semibold mb-2">
            Explore Biblical History & Scholarship
          </h2>
          <p className="text-muted-foreground">
            Intellectually honest exploration of hard questions
          </p>
        </div>

        {/* Continue Reading Section */}
        {recentTopics.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Continue Reading</h3>
            </div>
            {recentTopics.map(topic => {
              const info = PILLAR_INFO[topic.pillar];
              return (
                <Link key={topic.slug} href={`/explore/${topic.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{topic.title}</p>
                        <p className="text-sm text-muted-foreground">{info.name}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Five Pillars */}
        <div className="space-y-3">
          {pillars.map(pillar => {
            const info = PILLAR_INFO[pillar];
            return (
              <Link key={pillar} href={`/explore?pillar=${pillar}`}>
                <Card
                  className={`border-l-4 ${pillarColors[pillar]} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="text-muted-foreground">
                      {pillarIcons[pillar]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{info.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {info.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Learning Paths */}
        {paths.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Learning Paths</h3>
              </div>
              <Link href="/paths">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            {paths.map(path => {
              const topics = pathTopics[path.slug] || [];
              const completedTopics = topics.filter(slug => progress.readTopics.includes(slug)).length;
              const pathProgress = topics.length > 0 ? {
                completedTopics,
                totalTopics: topics.length,
                isStarted: completedTopics > 0,
                isCompleted: completedTopics === topics.length,
              } : undefined;

              return (
                <PathCard
                  key={path.slug}
                  path={path}
                  progress={pathProgress}
                />
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/explore">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Compass className="h-8 w-8 mb-2 text-primary" />
                <span className="font-medium">All Topics</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/read">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Book className="h-8 w-8 mb-2 text-primary" />
                <span className="font-medium">Read Bible</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Admin Quick Access */}
        {isAdmin && (
          <Card className="border-dashed">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary">Admin Mode</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Content management enabled
                  </p>
                </div>
                <Link href="/admin/topics/new">
                  <Button size="sm">New Topic</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
