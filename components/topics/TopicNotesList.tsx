// components/topics/TopicNotesList.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { TopicNoteEditor } from './TopicNoteEditor';
import type { TopicNote } from '@/lib/user/types';

interface TopicNotesListProps {
  topicSlug: string;
}

export function TopicNotesList({ topicSlug }: TopicNotesListProps) {
  const { getTopicNotes, removeTopicNote } = useUserData();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const notes = getTopicNotes(topicSlug);

  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No notes yet. Add one above!
      </p>
    );
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      removeTopicNote(id);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note.id}>
          {editingNoteId === note.id ? (
            <TopicNoteEditor
              topicSlug={topicSlug}
              existingNote={note}
              onSave={() => setEditingNoteId(null)}
              onCancel={() => setEditingNoteId(null)}
            />
          ) : (
            <Card>
              <CardContent className="py-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(note.updatedAt)}
                      {note.sectionIndex !== undefined && (
                        <span> · Section {note.sectionIndex + 1}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingNoteId(note.id)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}
