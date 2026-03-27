// components/topics/TopicNoteEditor.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useUserData } from '@/contexts/UserDataContext';
import type { TopicNote } from '@/lib/user/types';

interface TopicNoteEditorProps {
  topicSlug: string;
  sectionIndex?: number;
  existingNote?: TopicNote;
  onSave?: () => void;
  onCancel?: () => void;
}

export function TopicNoteEditor({
  topicSlug,
  sectionIndex,
  existingNote,
  onSave,
  onCancel,
}: TopicNoteEditorProps) {
  const [content, setContent] = useState(existingNote?.content || '');
  const [saving, setSaving] = useState(false);
  const { addTopicNote, updateTopicNote } = useUserData();

  const handleSave = () => {
    if (!content.trim()) return;

    setSaving(true);

    if (existingNote) {
      updateTopicNote(existingNote.id, content.trim());
    } else {
      addTopicNote(topicSlug, content.trim(), sectionIndex);
    }

    setSaving(false);
    onSave?.();
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <Textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!content.trim() || saving}
        >
          {existingNote ? 'Update' : 'Save'} Note
        </Button>
      </CardFooter>
    </Card>
  );
}
