// components/paths/PathCard.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import type { PathIndexEntry } from '@/lib/paths/types';
import { DIFFICULTY_INFO } from '@/lib/paths/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PathCardProps {
  path: PathIndexEntry;
  progress?: {
    completedTopics: number;
    totalTopics: number;
    isStarted: boolean;
    isCompleted: boolean;
  };
}

const difficultyColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function PathCard({ path, progress }: PathCardProps) {
  const difficultyInfo = DIFFICULTY_INFO[path.difficulty];
  const pillarInfo = path.pillar ? PILLAR_INFO[path.pillar] : null;
  const percentage = progress
    ? Math.round((progress.completedTopics / progress.totalTopics) * 100)
    : 0;

  return (
    <Link href={`/paths/${path.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2">{path.title}</h3>
            {progress?.isCompleted && (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {path.description}
          </p>

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
              {path.topicCount} topics
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {path.estimatedMinutes} min
            </span>
          </div>

          {progress?.isStarted && !progress.isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
