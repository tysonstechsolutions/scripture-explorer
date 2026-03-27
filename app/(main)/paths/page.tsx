// app/(main)/paths/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { PathCard } from '@/components/paths/PathCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import type { PathIndexEntry } from '@/lib/paths/types';
import { DIFFICULTY_INFO } from '@/lib/paths/types';
import type { PathDifficulty } from '@/lib/paths/types';

const difficulties: PathDifficulty[] = ['beginner', 'intermediate', 'advanced'];

export default function PathsPage() {
  const [paths, setPaths] = useState<PathIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<PathDifficulty | 'all'>('all');
  const { progress, getPathProgress } = useTopicProgress();

  useEffect(() => {
    async function loadPaths() {
      try {
        const params = new URLSearchParams({ status: 'published' });
        if (selectedDifficulty !== 'all') {
          params.set('difficulty', selectedDifficulty);
        }

        const res = await fetch(`/api/paths?${params}`);
        if (res.ok) {
          const data = await res.json();
          setPaths(data.paths);
        }
      } catch (error) {
        console.error('Failed to load paths:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPaths();
  }, [selectedDifficulty]);

  // Fetch topic counts for progress calculation
  const [pathTopics, setPathTopics] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function loadPathTopics() {
      const topicsMap: Record<string, string[]> = {};
      for (const path of paths) {
        try {
          const res = await fetch(`/api/paths/${path.slug}`);
          if (res.ok) {
            const data = await res.json();
            topicsMap[path.slug] = data.path.topics;
          }
        } catch {
          // ignore
        }
      }
      setPathTopics(topicsMap);
    }

    if (paths.length > 0) {
      loadPathTopics();
    }
  }, [paths]);

  return (
    <div className="pb-20">
      <Header title="Learning Paths" />

      <div className="p-4">
        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty('all')}
          >
            All Levels
          </Button>
          {difficulties.map(difficulty => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {DIFFICULTY_INFO[difficulty].label}
            </Button>
          ))}
        </div>

        {/* Paths Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : paths.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No learning paths available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paths.map(path => {
              const topics = pathTopics[path.slug] || [];
              const pathProgress = getPathProgress(path.slug, topics);
              const isStarted = pathProgress.completed > 0;
              const isCompleted = pathProgress.completed === pathProgress.total && pathProgress.total > 0;

              return (
                <PathCard
                  key={path.slug}
                  path={path}
                  progress={{
                    completedTopics: pathProgress.completed,
                    totalTopics: pathProgress.total,
                    isStarted,
                    isCompleted,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
