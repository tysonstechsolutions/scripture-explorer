// app/(main)/paths/[slug]/page.tsx

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PathProgress } from '@/components/paths/PathProgress';
import { PathTopicList } from '@/components/paths/PathTopicList';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, BookOpen } from 'lucide-react';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import type { LearningPath } from '@/lib/paths/types';
import type { TopicIndexEntry } from '@/lib/topics/types';
import { DIFFICULTY_INFO } from '@/lib/paths/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const difficultyColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function PathDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { progress, startPath } = useTopicProgress();

  useEffect(() => {
    async function loadPath() {
      try {
        const res = await fetch(`/api/paths/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPath(data.path);
          setTopics(data.topics);
        } else {
          router.push('/paths');
        }
      } catch (error) {
        console.error('Failed to load path:', error);
        router.push('/paths');
      } finally {
        setLoading(false);
      }
    }

    loadPath();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="pb-20">
        <Header title="Loading..." showBack />
        <div className="p-4 space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!path) {
    return null;
  }

  const difficultyInfo = DIFFICULTY_INFO[path.difficulty];
  const pillarInfo = path.pillar ? PILLAR_INFO[path.pillar] : null;

  const handleStart = () => {
    startPath(path.slug);
  };

  return (
    <div className="pb-20">
      <Header title={path.title} showBack />

      <div className="p-4 space-y-6">
        {/* Path Info */}
        <div className="space-y-3">
          <p className="text-muted-foreground">{path.description}</p>

          <div className="flex flex-wrap gap-2">
            <Badge className={difficultyColors[difficultyInfo.color]}>
              {difficultyInfo.label}
            </Badge>
            {pillarInfo && (
              <Badge variant="outline">{pillarInfo.name}</Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {path.topics.length} topics
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {path.estimatedMinutes} min
            </span>
          </div>

          {path.longDescription && (
            <p className="text-sm">{path.longDescription}</p>
          )}
        </div>

        {/* Progress */}
        <PathProgress
          pathSlug={path.slug}
          topics={topics}
          readTopics={progress.readTopics}
          onStart={handleStart}
        />

        {/* Topic List */}
        <div>
          <h2 className="font-semibold mb-3">Topics in this Path</h2>
          <PathTopicList
            topics={topics}
            readTopics={progress.readTopics}
            pathSlug={path.slug}
          />
        </div>
      </div>
    </div>
  );
}
