// components/reading-plans/ReadingPlanProgress.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, BookOpen } from 'lucide-react';
import type { ChapterReading } from '@/lib/reading-plans/types';

interface ReadingPlanProgressProps {
  planSlug: string;
  readings: ChapterReading[];
  completedReadings: string[]; // Format: "book-chapter" e.g., "john-1"
  onMarkComplete?: (reading: ChapterReading) => void;
  onMarkIncomplete?: (reading: ChapterReading) => void;
}

function getReadingKey(reading: ChapterReading): string {
  return `${reading.book.toLowerCase()}-${reading.chapter}`;
}

export function ReadingPlanProgress({
  planSlug,
  readings,
  completedReadings,
  onMarkComplete,
  onMarkIncomplete,
}: ReadingPlanProgressProps) {
  const completedCount = readings.filter(r =>
    completedReadings.includes(getReadingKey(r))
  ).length;
  const percentage = readings.length > 0
    ? Math.round((completedCount / readings.length) * 100)
    : 0;

  // Find the next unread chapter
  const nextReading = readings.find(r => !completedReadings.includes(getReadingKey(r)));

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {completedCount} of {readings.length} chapters read
          </span>
          <span className="font-medium">{percentage}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Continue Button */}
      {nextReading && (
        <Link href={`/read/${nextReading.book.toLowerCase()}/${nextReading.chapter}`}>
          <Button className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            {completedCount === 0 ? 'Start Reading' : 'Continue Reading'}
            <span className="ml-2 text-sm opacity-80">
              {nextReading.book} {nextReading.chapter}
            </span>
          </Button>
        </Link>
      )}

      {completedCount === readings.length && readings.length > 0 && (
        <div className="text-center py-4">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-green-600">Plan Completed!</p>
          <p className="text-sm text-muted-foreground">
            You&apos;ve finished all {readings.length} chapters
          </p>
        </div>
      )}

      {/* Reading List */}
      <div className="space-y-1">
        {readings.map((reading, index) => {
          const key = getReadingKey(reading);
          const isComplete = completedReadings.includes(key);

          return (
            <div
              key={key}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isComplete ? 'bg-green-50 dark:bg-green-950/20' : 'hover:bg-muted'
              }`}
            >
              <button
                onClick={() => {
                  if (isComplete) {
                    onMarkIncomplete?.(reading);
                  } else {
                    onMarkComplete?.(reading);
                  }
                }}
                className="flex-shrink-0"
              >
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              <Link
                href={`/read/${reading.book.toLowerCase()}/${reading.chapter}`}
                className="flex-1 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm text-muted-foreground mr-2">
                    Day {index + 1}
                  </span>
                  <span className={isComplete ? 'line-through text-muted-foreground' : ''}>
                    {reading.book} {reading.chapter}
                  </span>
                  {reading.title && (
                    <span className="text-sm text-muted-foreground ml-2">
                      — {reading.title}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
