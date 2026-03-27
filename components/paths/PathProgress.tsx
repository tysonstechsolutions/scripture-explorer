// components/paths/PathProgress.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, PlayCircle } from 'lucide-react';
import type { TopicIndexEntry } from '@/lib/topics/types';

interface PathProgressProps {
  pathSlug: string;
  topics: TopicIndexEntry[];
  readTopics: string[];
  onStart?: () => void;
}

export function PathProgress({
  pathSlug,
  topics,
  readTopics,
  onStart,
}: PathProgressProps) {
  const completedCount = topics.filter(t => readTopics.includes(t.slug)).length;
  const totalCount = topics.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted = completedCount === totalCount && totalCount > 0;
  const isStarted = completedCount > 0;

  // Find next unread topic
  const nextTopic = topics.find(t => !readTopics.includes(t.slug));

  return (
    <Card>
      <CardContent className="py-6 space-y-4">
        {isCompleted ? (
          <div className="text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-semibold text-green-600">Path Completed!</p>
            <p className="text-sm text-muted-foreground">
              You've read all {totalCount} topics
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{percentage}%</div>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} topics completed
              </p>
            </div>

            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {nextTopic && (
              <Link href={`/explore/${nextTopic.slug}?from=path&path=${pathSlug}`}>
                <Button className="w-full" size="lg">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  {isStarted ? 'Continue Reading' : 'Start Path'}
                </Button>
              </Link>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
