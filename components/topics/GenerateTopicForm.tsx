// components/topics/GenerateTopicForm.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import type { Pillar, DeepDiveSection, ScriptureRef } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface GeneratedContent {
  hook: string;
  overview: string;
  deepDive: DeepDiveSection[];
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[];
}

interface GenerateTopicFormProps {
  onGenerated: (content: GeneratedContent, title: string, pillar: Pillar) => void;
}

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];

export function GenerateTopicForm({ onGenerated }: GenerateTopicFormProps) {
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState<Pillar>('text');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Please enter a topic title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, pillar, context: context || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Generation failed');
      }

      const { content } = await res.json();
      onGenerated(content, title, pillar);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Topic Title</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g., Council of Nicaea"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="pillar">Pillar</Label>
        <Select value={pillar} onValueChange={v => setPillar(v as Pillar)} disabled={loading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pillars.map(p => (
              <SelectItem key={p} value={p}>
                {PILLAR_INFO[p].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="context">Additional Context (optional)</Label>
        <Textarea
          id="context"
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="Any specific objections to address or angles to explore..."
          rows={3}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
          <Button
            variant="link"
            size="sm"
            className="ml-2 p-0 h-auto text-red-600 underline"
            onClick={handleGenerate}
          >
            Try Again
          </Button>
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={loading || !title.trim()}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating (30-60s)...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Draft
          </>
        )}
      </Button>
    </div>
  );
}
