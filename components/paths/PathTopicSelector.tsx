// components/paths/PathTopicSelector.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Search } from 'lucide-react';
import type { TopicIndexEntry } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PathTopicSelectorProps {
  selectedTopics: string[];
  onChange: (topics: string[]) => void;
}

export function PathTopicSelector({ selectedTopics, onChange }: PathTopicSelectorProps) {
  const [allTopics, setAllTopics] = useState<TopicIndexEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch('/api/topics?status=published');
        if (res.ok) {
          const data = await res.json();
          setAllTopics(data.topics);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  const selectedTopicData = selectedTopics
    .map(slug => allTopics.find(t => t.slug === slug))
    .filter(Boolean) as TopicIndexEntry[];

  const availableTopics = allTopics.filter(
    t => !selectedTopics.includes(t.slug) &&
      (search === '' || t.title.toLowerCase().includes(search.toLowerCase()))
  );

  const addTopic = (slug: string) => {
    onChange([...selectedTopics, slug]);
  };

  const removeTopic = (slug: string) => {
    onChange(selectedTopics.filter(s => s !== slug));
  };

  const moveTopic = (fromIndex: number, toIndex: number) => {
    const newTopics = [...selectedTopics];
    const [removed] = newTopics.splice(fromIndex, 1);
    newTopics.splice(toIndex, 0, removed);
    onChange(newTopics);
  };

  return (
    <div className="space-y-4">
      {/* Selected Topics */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Selected Topics ({selectedTopics.length})
        </label>
        {selectedTopicData.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
            No topics selected. Add topics from below.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedTopicData.map((topic, index) => (
              <Card key={topic.slug}>
                <CardContent className="flex items-center gap-3 py-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => index > 0 && moveTopic(index, index - 1)}
                      disabled={index === 0}
                    >
                      <span className="text-xs">↑</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => index < selectedTopics.length - 1 && moveTopic(index, index + 1)}
                      disabled={index === selectedTopics.length - 1}
                    >
                      <span className="text-xs">↓</span>
                    </Button>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{topic.title}</p>
                    <Badge variant="secondary" className="text-xs">
                      {PILLAR_INFO[topic.pillar].name}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTopic(topic.slug)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Topics */}
      <div>
        <label className="text-sm font-medium mb-2 block">Add Topics</label>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading topics...</p>
        ) : availableTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {search ? 'No matching topics found.' : 'All topics have been added.'}
          </p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-1 border rounded-md p-2">
            {availableTopics.map(topic => (
              <button
                type="button"
                key={topic.slug}
                onClick={() => addTopic(topic.slug)}
                className="w-full text-left p-2 rounded hover:bg-muted flex items-center gap-2"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate text-sm">{topic.title}</span>
                <Badge variant="outline" className="text-xs">
                  {PILLAR_INFO[topic.pillar].name}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
