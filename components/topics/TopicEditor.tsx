// components/topics/TopicEditor.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Eye, Plus, Trash2 } from 'lucide-react';
import type { Topic, Pillar, DeepDiveSection } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';
import { nanoid } from 'nanoid';

interface TopicEditorProps {
  initialTopic?: Partial<Topic>;
  onSave: (topic: Omit<Topic, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onPreview?: () => void;
}

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];

export function TopicEditor({ initialTopic, onSave, onPreview }: TopicEditorProps) {
  const [title, setTitle] = useState(initialTopic?.title || '');
  const [pillar, setPillar] = useState<Pillar>(initialTopic?.pillar || 'text');
  const [status, setStatus] = useState<'draft' | 'review' | 'published'>(
    initialTopic?.status || 'draft'
  );
  const [hook, setHook] = useState(initialTopic?.hook || '');
  const [overview, setOverview] = useState(initialTopic?.overview || '');
  const [deepDive, setDeepDive] = useState<DeepDiveSection[]>(
    initialTopic?.deepDive || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSection = () => {
    setDeepDive([...deepDive, { id: nanoid(), title: '', content: '' }]);
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setDeepDive(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const removeSection = (id: string) => {
    setDeepDive(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim() || !hook.trim() || !overview.trim()) {
      setError('Title, hook, and overview are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        title,
        pillar,
        status,
        hook,
        overview,
        deepDive,
        scriptureRefs: initialTopic?.scriptureRefs || [],
        relatedTopics: initialTopic?.relatedTopics || [],
        timelineEra: initialTopic?.timelineEra,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Topic title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pillar</Label>
              <Select value={pillar} onValueChange={v => setPillar(v as Pillar)}>
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
              <Label>Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hook */}
      <Card>
        <CardHeader>
          <CardTitle>Hook (Layer 1)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={hook}
            onChange={e => setHook(e.target.value)}
            placeholder="2-3 sentence hook that captures attention..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview (Layer 2)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={overview}
            onChange={e => setOverview(e.target.value)}
            placeholder="Main article content in markdown..."
            rows={15}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Deep Dive Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Deep Dive Sections (Layer 3)</CardTitle>
          <Button variant="outline" size="sm" onClick={addSection}>
            <Plus className="h-4 w-4 mr-1" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {deepDive.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No deep dive sections yet. Click "Add Section" to create one.
            </p>
          ) : (
            deepDive.map((section, index) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Section {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
                <Input
                  value={section.title}
                  onChange={e => updateSection(section.id, 'title', e.target.value)}
                  placeholder="Section title"
                />
                <Textarea
                  value={section.content}
                  onChange={e => updateSection(section.id, 'content', e.target.value)}
                  placeholder="Section content in markdown..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Topic
            </>
          )}
        </Button>
        {onPreview && (
          <Button variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        )}
      </div>
    </div>
  );
}
