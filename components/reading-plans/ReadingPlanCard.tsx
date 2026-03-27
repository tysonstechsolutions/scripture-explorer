// components/reading-plans/ReadingPlanCard.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import type { ReadingPlanIndexEntry } from '@/lib/reading-plans/types';
import { DIFFICULTY_INFO, CATEGORY_INFO } from '@/lib/reading-plans/types';

interface ReadingPlanCardProps {
  plan: ReadingPlanIndexEntry;
  progress?: {
    completedReadings: number;
    totalReadings: number;
    isStarted: boolean;
    isCompleted: boolean;
  };
}

const difficultyColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function ReadingPlanCard({ plan, progress }: ReadingPlanCardProps) {
  const difficultyInfo = DIFFICULTY_INFO[plan.difficulty];
  const categoryInfo = CATEGORY_INFO[plan.category];
  const percentage = progress
    ? Math.round((progress.completedReadings / progress.totalReadings) * 100)
    : 0;

  return (
    <Link href={`/plans/${plan.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2">{plan.title}</h3>
            {progress?.isCompleted && (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {plan.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge className={difficultyColors[difficultyInfo.color]}>
              {difficultyInfo.label}
            </Badge>
            <Badge variant="outline">{categoryInfo.label}</Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {plan.readingCount} chapters
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {plan.estimatedDays} days
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
