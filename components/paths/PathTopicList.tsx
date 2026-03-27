// components/paths/PathTopicList.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import type { TopicIndexEntry } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PathTopicListProps {
  topics: TopicIndexEntry[];
  readTopics: string[];
  pathSlug: string;
}

export function PathTopicList({ topics, readTopics, pathSlug }: PathTopicListProps) {
  return (
    <div className="space-y-3">
      {topics.map((topic, index) => {
        const isRead = readTopics.includes(topic.slug);
        const pillarInfo = PILLAR_INFO[topic.pillar];

        return (
          <Link
            key={topic.slug}
            href={`/explore/${topic.slug}?from=path&path=${pathSlug}`}
          >
            <Card
              className={`hover:shadow-sm transition-shadow cursor-pointer ${
                isRead ? 'border-green-200 dark:border-green-800' : ''
              }`}
            >
              <CardContent className="flex items-center gap-4 py-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{topic.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {topic.hook}
                  </p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {pillarInfo.name}
                  </Badge>
                </div>

                {isRead ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
