// components/topics/TopicCard.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import { useAdmin } from '@/contexts/AdminContext';
import type { TopicIndexEntry, Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface TopicCardProps {
  topic: TopicIndexEntry;
}

const pillarColorMap: Record<Pillar, string> = {
  text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  prophecy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  church: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  judaism: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  branches: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColorMap = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export function TopicCard({ topic }: TopicCardProps) {
  const { isRead } = useTopicProgress();
  const { isAdmin } = useAdmin();
  const read = isRead(topic.slug);
  const pillarInfo = PILLAR_INFO[topic.pillar];

  // Don't show drafts to non-admin users
  if (topic.status !== 'published' && !isAdmin) {
    return null;
  }

  return (
    <Link href={`/explore/${topic.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{topic.title}</CardTitle>
            {read && (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="secondary" className={pillarColorMap[topic.pillar]}>
              {pillarInfo.name}
            </Badge>
            {isAdmin && topic.status !== 'published' && (
              <Badge variant="secondary" className={statusColorMap[topic.status]}>
                {topic.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {topic.hook}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
