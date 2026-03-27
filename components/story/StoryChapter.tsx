// components/story/StoryChapter.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScripturePopover } from './ScripturePopover';
import type { StoryChapter as StoryChapterType, TimelineEvent } from '@/lib/story/types';
import { STORY_ERAS } from '@/lib/story/types';

interface StoryChapterProps {
  chapter: StoryChapterType;
  content: string;
}

export function StoryChapter({ chapter, content }: StoryChapterProps) {
  const [expandedDeepDives, setExpandedDeepDives] = useState<Set<string>>(new Set());

  const era = STORY_ERAS.find(e => e.id === chapter.era);

  // Parse content and replace special markers with interactive elements
  const renderContent = (rawContent: string) => {
    // Split content into sections
    const sections = rawContent.split('\n\n');

    return sections.map((section, idx) => {
      // Skip metadata sections at the end
      if (section.startsWith('## Timeline') || section.startsWith('## Go Deeper') || section.startsWith('---')) {
        return null;
      }

      // Handle headers
      if (section.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-3xl font-bold mb-6 mt-8 first:mt-0">
            {section.replace('# ', '')}
          </h1>
        );
      }
      if (section.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-semibold mb-4 mt-8">
            {section.replace('## ', '')}
          </h2>
        );
      }

      // Handle scripture blocks
      if (section.startsWith('{scripture:')) {
        const match = section.match(/\{scripture:([^}]+)\}\s*>\s*(.+)/s);
        if (match) {
          const [, reference, text] = match;
          return (
            <blockquote key={idx} className="border-l-4 border-primary bg-muted/30 p-4 my-6 rounded-r-lg">
              <p className="italic text-lg leading-relaxed mb-2">{text.trim()}</p>
              <cite className="text-sm text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <ScripturePopover reference={reference}>{reference}</ScripturePopover>
              </cite>
            </blockquote>
          );
        }
      }

      // Handle deep-dive markers
      if (section.includes('{deep-dive:')) {
        const parts = section.split(/(\{deep-dive:[^}]+\})/);
        return (
          <p key={idx} className="mb-4 leading-relaxed text-lg">
            {parts.map((part, partIdx) => {
              const deepDiveMatch = part.match(/\{deep-dive:([^}]+)\}/);
              if (deepDiveMatch) {
                const deepDiveId = deepDiveMatch[1];
                return (
                  <Button
                    key={partIdx}
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-primary hover:text-primary/80"
                    onClick={() => {
                      setExpandedDeepDives(prev => {
                        const next = new Set(prev);
                        if (next.has(deepDiveId)) {
                          next.delete(deepDiveId);
                        } else {
                          next.add(deepDiveId);
                        }
                        return next;
                      });
                    }}
                  >
                    <Compass className="h-3 w-3 mr-1" />
                    Go deeper
                  </Button>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      }

      // Handle inline scripture references
      if (section.includes('{scripture:')) {
        const parts = section.split(/(\{scripture:[^}]+\})/);
        return (
          <p key={idx} className="mb-4 leading-relaxed text-lg">
            {parts.map((part, partIdx) => {
              const scriptureMatch = part.match(/\{scripture:([^}]+)\}/);
              if (scriptureMatch) {
                const reference = scriptureMatch[1];
                return (
                  <ScripturePopover key={partIdx} reference={reference}>
                    {reference}
                  </ScripturePopover>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      }

      // Handle map markers (placeholder for now)
      if (section.includes('{map:')) {
        return (
          <Card key={idx} className="my-6 bg-muted/20">
            <CardContent className="p-4 text-center text-muted-foreground">
              <Compass className="h-8 w-8 mx-auto mb-2" />
              <p>Interactive map coming soon</p>
            </CardContent>
          </Card>
        );
      }

      // Handle next/prev chapter markers
      if (section.includes('{next-chapter:') || section.includes('{prev-chapter:')) {
        return null; // Handled in navigation
      }

      // Regular paragraph
      if (section.trim()) {
        return (
          <p key={idx} className="mb-4 leading-relaxed text-lg">
            {section}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <Link href="/story">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            All Chapters
          </Button>
        </Link>

        {era && (
          <Badge variant="outline" className="mb-2">
            {era.name} • {era.range}
          </Badge>
        )}

        <h1 className="text-4xl font-bold mb-2">{chapter.title}</h1>

        <p className="text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Chapter {chapter.order} of the Story
        </p>
      </header>

      {/* Main Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {renderContent(content)}
      </div>

      {/* Timeline */}
      {chapter.timeline && chapter.timeline.length > 0 && (
        <Card className="mt-12">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline
            </h3>
            <div className="space-y-3">
              {chapter.timeline.map((event: TimelineEvent, idx: number) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="text-sm font-mono text-muted-foreground min-w-[120px]">
                    {event.date}
                  </span>
                  <span>{event.event}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <nav className="mt-12 pt-8 border-t flex justify-between">
        {chapter.prevChapter ? (
          <Link href={`/story/${chapter.prevChapter}`}>
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Chapter
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {chapter.nextChapter ? (
          <Link href={`/story/${chapter.nextChapter}`}>
            <Button>
              Next Chapter
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
