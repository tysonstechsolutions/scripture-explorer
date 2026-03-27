// components/timeline/EraTopics.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import { TopicCard } from '@/components/topics/TopicCard';
import type { TopicIndexEntry } from '@/lib/topics/types';

interface EraTopicsProps {
  eraId: string;
}

export function EraTopics({ eraId }: EraTopicsProps) {
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch(`/api/topics/by-era/${eraId}`);
        if (res.ok) {
          const data = await res.json();
          setTopics(data.topics);
        }
      } catch (error) {
        console.error('Failed to fetch topics for era:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, [eraId]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-body font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Related Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (topics.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-body font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Related Topics ({topics.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
