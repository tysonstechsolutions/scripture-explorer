// lib/hooks/useTopicsForPassage.ts

'use client';

import { useState, useEffect } from 'react';
import type { TopicIndexEntry, ScriptureRef } from '@/lib/topics/types';

interface TopicWithRefs extends TopicIndexEntry {
  scriptureRefs?: ScriptureRef[];
}

export function useTopicsForPassage(bookId: string, chapter: number): TopicIndexEntry[] {
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);

  useEffect(() => {
    if (!bookId || !chapter) {
      setTopics([]);
      return;
    }

    async function fetchTopics() {
      try {
        // Fetch all published topics
        const res = await fetch('/api/topics?status=published');
        if (!res.ok) return;

        const data = await res.json();
        const allTopics: TopicIndexEntry[] = data.topics;

        // For each topic, fetch full data to check scriptureRefs
        const matchingTopics: TopicIndexEntry[] = [];

        for (const topicEntry of allTopics) {
          const topicRes = await fetch(`/api/topics/${topicEntry.slug}`);
          if (!topicRes.ok) continue;

          const topicData = await topicRes.json();
          const topic = topicData.topic;

          // Check if any scriptureRef matches this book/chapter
          const hasMatch = topic.scriptureRefs?.some(
            (ref: ScriptureRef) =>
              ref.bookId.toUpperCase() === bookId.toUpperCase() &&
              ref.chapter === chapter
          );

          if (hasMatch) {
            matchingTopics.push(topicEntry);
          }
        }

        setTopics(matchingTopics);
      } catch (error) {
        console.error('Failed to fetch topics for passage:', error);
      }
    }

    fetchTopics();
  }, [bookId, chapter]);

  return topics;
}
