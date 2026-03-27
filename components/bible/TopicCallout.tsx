// components/bible/TopicCallout.tsx

'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import type { TopicIndexEntry } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface TopicCalloutProps {
  topic: TopicIndexEntry;
}

const pillarColors: Record<string, string> = {
  text: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  prophecy: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  church: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  judaism: 'bg-green-100 text-green-800 hover:bg-green-200',
  branches: 'bg-red-100 text-red-800 hover:bg-red-200',
};

export function TopicCallout({ topic }: TopicCalloutProps) {
  return (
    <Link href={`/explore/${topic.slug}`}>
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${pillarColors[topic.pillar]}`}>
        <BookOpen className="h-3.5 w-3.5" />
        <span className="font-medium">{topic.title}</span>
        <Badge variant="secondary" className="text-xs py-0 px-1.5">
          {PILLAR_INFO[topic.pillar].name.split(' ')[0]}
        </Badge>
      </div>
    </Link>
  );
}
