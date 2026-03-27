// components/scripture/ScripturePanel.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { ScriptureRef, TopicIndexEntry } from '@/lib/topics/types';
import { getBookById } from '@/lib/bible/books';
import { TopicCallout } from '@/components/bible/TopicCallout';

interface ScripturePanelProps {
  reference: ScriptureRef | null;
  isOpen: boolean;
  onClose: () => void;
}

interface VerseData {
  bookName: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
  text: string;
}

export function ScripturePanel({ reference, isOpen, onClose }: ScripturePanelProps) {
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [relatedTopics, setRelatedTopics] = useState<TopicIndexEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference || !isOpen) {
      setVerseData(null);
      setRelatedTopics([]);
      return;
    }

    const currentRef = reference; // Capture for closure

    async function fetchVerse() {
      setLoading(true);
      setError(null);

      try {
        const book = getBookById(currentRef.bookId);
        if (!book) {
          throw new Error('Book not found');
        }

        const params = new URLSearchParams({
          book: book.id,
          chapter: String(currentRef.chapter),
          verse: String(currentRef.verse),
        });

        const res = await fetch(`/api/bible?${params}`);
        if (!res.ok) {
          throw new Error('Failed to fetch verse');
        }

        const data = await res.json();

        setVerseData({
          bookName: book.name,
          chapter: currentRef.chapter,
          verse: currentRef.verse,
          verseEnd: currentRef.verseEnd,
          text: data.content || data.text || 'Verse text not available',
        });

        // Fetch related topics
        await fetchRelatedTopics(currentRef.bookId, currentRef.chapter);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load verse');
      } finally {
        setLoading(false);
      }
    }

    async function fetchRelatedTopics(bookId: string, chapter: number) {
      try {
        const topicsRes = await fetch('/api/topics?status=published');
        if (!topicsRes.ok) return;

        const topicsData = await topicsRes.json();
        const matching: TopicIndexEntry[] = [];

        for (const entry of topicsData.topics) {
          const topicRes = await fetch(`/api/topics/${entry.slug}`);
          if (!topicRes.ok) continue;

          const { topic } = await topicRes.json();
          const hasMatch = topic.scriptureRefs?.some(
            (ref: ScriptureRef) =>
              ref.bookId.toUpperCase() === bookId.toUpperCase() &&
              ref.chapter === chapter
          );

          if (hasMatch) {
            matching.push(entry);
          }
        }

        setRelatedTopics(matching);
      } catch (error) {
        console.error('Failed to fetch related topics:', error);
      }
    }

    fetchVerse();
  }, [reference, isOpen]);

  const book = reference ? getBookById(reference.bookId) : null;
  const referenceText = reference && book
    ? `${book.name} ${reference.chapter}:${reference.verse}${reference.verseEnd ? `-${reference.verseEnd}` : ''}`
    : '';

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>{referenceText || 'Scripture'}</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : verseData ? (
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">{verseData.text}</p>

              {book && (
                <Link
                  href={`/read/${book.id.toLowerCase()}/${reference?.chapter}`}
                  onClick={onClose}
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read full chapter
                  </Button>
                </Link>
              )}

              {relatedTopics.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedTopics.map((topic) => (
                      <div key={topic.slug} onClick={onClose}>
                        <TopicCallout topic={topic} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
