// app/(main)/explore/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { TopicCard } from '@/components/topics/TopicCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/contexts/AdminContext';
import type { TopicIndexEntry, Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];

export default function ExplorePage() {
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | 'all'>('all');
  const { isAdmin } = useAdmin();

  useEffect(() => {
    async function loadTopics() {
      try {
        const params = new URLSearchParams();
        if (selectedPillar !== 'all') {
          params.set('pillar', selectedPillar);
        }
        // Only show published topics for non-admin users
        if (!isAdmin) {
          params.set('status', 'published');
        }

        const res = await fetch(`/api/topics?${params}`);
        if (res.ok) {
          const data = await res.json();
          setTopics(data.topics);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, [selectedPillar, isAdmin]);

  return (
    <div className="pb-20">
      <Header title="Explore" />

      <div className="p-4">
        {/* Pillar Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedPillar === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPillar('all')}
          >
            All
          </Button>
          {pillars.map(pillar => (
            <Button
              key={pillar}
              variant={selectedPillar === pillar ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPillar(pillar)}
            >
              {PILLAR_INFO[pillar].name}
            </Button>
          ))}
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No topics found.</p>
            {isAdmin && (
              <p className="mt-2">
                <a href="/admin/topics/new" className="text-primary underline">
                  Create your first topic
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map(topic => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
