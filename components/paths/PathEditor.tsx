// components/paths/PathEditor.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PathTopicSelector } from './PathTopicSelector';
import type { LearningPath, PathDifficulty } from '@/lib/paths/types';
import type { Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PathEditorProps {
  path?: LearningPath;
  onSave: (data: Partial<LearningPath>) => Promise<void>;
  onCancel: () => void;
}

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];
const difficulties: PathDifficulty[] = ['beginner', 'intermediate', 'advanced'];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function PathEditor({ path, onSave, onCancel }: PathEditorProps) {
  const [title, setTitle] = useState(path?.title || '');
  const [slug, setSlug] = useState(path?.slug || '');
  const [description, setDescription] = useState(path?.description || '');
  const [longDescription, setLongDescription] = useState(path?.longDescription || '');
  const [pillar, setPillar] = useState<Pillar | ''>(path?.pillar || '');
  const [difficulty, setDifficulty] = useState<PathDifficulty>(path?.difficulty || 'beginner');
  const [estimatedMinutes, setEstimatedMinutes] = useState(path?.estimatedMinutes || 30);
  const [topics, setTopics] = useState<string[]>(path?.topics || []);
  const [status, setStatus] = useState<'draft' | 'published'>(path?.status || 'draft');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!path && title) {
      setSlug(generateSlug(title));
    }
  }, [title, path]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        title,
        slug,
        description,
        longDescription: longDescription || undefined,
        pillar: pillar || undefined,
        difficulty,
        estimatedMinutes,
        topics,
        status,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Understanding Biblical Prophecy"
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="understanding-biblical-prophecy"
            required
            disabled={!!path}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="A short description for the path card..."
            rows={2}
            required
          />
        </div>

        <div>
          <Label htmlFor="longDescription">Long Description (optional)</Label>
          <Textarea
            id="longDescription"
            value={longDescription}
            onChange={e => setLongDescription(e.target.value)}
            placeholder="A more detailed introduction shown on the path detail page..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pillar">Primary Pillar (optional)</Label>
            <Select value={pillar} onValueChange={(v) => setPillar(v as Pillar | '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {pillars.map(p => (
                  <SelectItem key={p} value={p}>
                    {PILLAR_INFO[p].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as PathDifficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(d => (
                  <SelectItem key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estimatedMinutes">Estimated Time (minutes)</Label>
            <Input
              id="estimatedMinutes"
              type="number"
              value={estimatedMinutes}
              onChange={e => setEstimatedMinutes(Number(e.target.value))}
              min={1}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'draft' | 'published')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Topics</Label>
          <PathTopicSelector
            selectedTopics={topics}
            onChange={setTopics}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : path ? 'Update Path' : 'Create Path'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
