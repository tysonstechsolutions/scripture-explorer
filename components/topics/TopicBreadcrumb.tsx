// components/topics/TopicBreadcrumb.tsx

'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface TopicBreadcrumbProps {
  pillar: Pillar;
  topicTitle?: string;
}

export function TopicBreadcrumb({ pillar, topicTitle }: TopicBreadcrumbProps) {
  const pillarInfo = PILLAR_INFO[pillar];

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      <Link href="/explore" className="hover:text-foreground transition-colors">
        Explore
      </Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link
        href={`/explore?pillar=${pillar}`}
        className="hover:text-foreground transition-colors"
      >
        {pillarInfo.name}
      </Link>
      {topicTitle && (
        <>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {topicTitle}
          </span>
        </>
      )}
    </nav>
  );
}
