// components/story/StoryChapter.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Compass, Sparkles } from 'lucide-react';
import { ScripturePopover } from './ScripturePopover';
import { StoryImage } from './StoryImage';
import { getStoryImage } from '@/lib/story/images';
import type { StoryChapter as StoryChapterType, TimelineEvent } from '@/lib/story/types';
import { STORY_ERAS } from '@/lib/story/types';

interface StoryChapterProps {
  chapter: StoryChapterType;
  content: string;
}

export function StoryChapter({ chapter, content }: StoryChapterProps) {
  const [expandedDeepDives, setExpandedDeepDives] = useState<Set<string>>(new Set());

  const era = STORY_ERAS.find(e => e.id === chapter.era);

  const renderContent = (rawContent: string) => {
    const sections = rawContent.split('\n\n');

    return sections.map((section, idx) => {
      // Skip metadata sections
      if (section.startsWith('## Timeline') || section.startsWith('## Go Deeper') || section.startsWith('---')) {
        return null;
      }

      // Main title - skip, we render it in the header
      if (section.startsWith('# ')) {
        return null;
      }

      // Section headers
      if (section.startsWith('## ')) {
        const title = section.replace('## ', '');
        return (
          <h2 key={idx} className="font-serif text-2xl md:text-3xl text-stone-800 dark:text-stone-100 mt-16 mb-6 relative">
            <span className="relative">
              {title}
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-transparent" />
            </span>
          </h2>
        );
      }

      // Scripture blocks with full quote
      if (section.startsWith('{scripture:')) {
        const match = section.match(/\{scripture:([^}]+)\}\s*>\s*(.+)/s);
        if (match) {
          const [, reference, text] = match;
          return (
            <figure key={idx} className="my-10 relative">
              {/* Decorative quote mark */}
              <div className="absolute -left-4 -top-4 text-7xl font-serif text-amber-200/50 dark:text-amber-800/30 leading-none select-none">
                &ldquo;
              </div>

              <blockquote className="relative bg-gradient-to-br from-amber-50/80 to-stone-50/80 dark:from-amber-950/30 dark:to-stone-900/50 rounded-2xl p-8 border-l-4 border-amber-500/60">
                <p className="font-serif text-xl md:text-2xl text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  {text.trim()}
                </p>
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-2 text-amber-700 dark:text-amber-500">
                <BookOpen className="h-4 w-4" />
                <ScripturePopover reference={reference}>
                  <span className="font-medium">{reference}</span>
                </ScripturePopover>
              </figcaption>
            </figure>
          );
        }
      }

      // Deep-dive markers
      if (section.includes('{deep-dive:')) {
        const parts = section.split(/(\{deep-dive:[^}]+\})/);
        return (
          <p key={idx} className="font-serif text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
            {parts.map((part, partIdx) => {
              const deepDiveMatch = part.match(/\{deep-dive:([^}]+)\}/);
              if (deepDiveMatch) {
                const deepDiveId = deepDiveMatch[1];
                return (
                  <span
                    key={partIdx}
                    role="button"
                    tabIndex={0}
                    className="inline-flex items-center gap-1.5 px-3 py-1 ml-2 rounded-full bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-sm font-sans font-medium hover:bg-amber-200/80 dark:hover:bg-amber-800/40 transition-colors cursor-pointer"
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedDeepDives(prev => {
                          const next = new Set(prev);
                          if (next.has(deepDiveId)) {
                            next.delete(deepDiveId);
                          } else {
                            next.add(deepDiveId);
                          }
                          return next;
                        });
                      }
                    }}
                  >
                    <Compass className="h-3.5 w-3.5" />
                    Explore
                  </span>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      }

      // Inline scripture references
      if (section.includes('{scripture:')) {
        const parts = section.split(/(\{scripture:[^}]+\})/);
        return (
          <p key={idx} className="font-serif text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
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

      // Image markers
      if (section.includes('{image:')) {
        const match = section.match(/\{image:([^}]+)\}/);
        if (match) {
          const imageId = match[1];
          const imageData = getStoryImage(imageId);
          if (imageData) {
            return (
              <StoryImage
                key={idx}
                src={imageData.src}
                alt={imageData.alt}
                caption={imageData.caption}
                credit={imageData.credit}
              />
            );
          }
        }
      }

      // Map markers
      if (section.includes('{map:')) {
        return (
          <div key={idx} className="my-10 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 dark:from-stone-900 dark:to-stone-950 border border-stone-200/60 dark:border-stone-800/60 p-8 text-center">
            <Compass className="h-10 w-10 mx-auto text-amber-600/60 mb-3" />
            <p className="text-stone-500 dark:text-stone-500">Interactive map coming soon</p>
          </div>
        );
      }

      // Skip navigation markers
      if (section.includes('{next-chapter:') || section.includes('{prev-chapter:')) {
        return null;
      }

      // Regular paragraphs
      if (section.trim()) {
        // Check for italicized emphasis (like *text*)
        const processedText = section.split(/(\*[^*]+\*)/g).map((part, i) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="text-amber-700 dark:text-amber-500">{part.slice(1, -1)}</em>;
          }
          return part;
        });

        return (
          <p key={idx} className="font-serif text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
            {processedText}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-amber-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      {/* Subtle texture */}
      <div className="fixed inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <article className="relative max-w-3xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <Link href="/story" className="inline-flex items-center gap-2 text-stone-500 dark:text-stone-500 hover:text-amber-700 dark:hover:text-amber-500 transition-colors mb-12 group">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-[0.1em]">All Chapters</span>
        </Link>

        {/* Chapter Header */}
        <header className="mb-16 text-center">
          {/* Era Badge */}
          {era && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/60 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40 mb-6">
              <span className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                {era.name}
              </span>
              <span className="text-amber-400 dark:text-amber-600">•</span>
              <span className="text-sm text-amber-600/80 dark:text-amber-500/80 font-mono">
                {era.range}
              </span>
            </div>
          )}

          {/* Chapter Number */}
          <p className="text-amber-600/60 dark:text-amber-500/60 uppercase tracking-[0.2em] text-sm mb-4">
            Chapter {chapter.order}
          </p>

          {/* Title with decorative elements */}
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/40" />
              <Sparkles className="h-4 w-4 text-amber-400/40" />
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-800 dark:text-stone-100 font-light tracking-tight">
              {chapter.title}
            </h1>

            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300 dark:to-stone-700" />
              <div className="h-2 w-2 rounded-full bg-amber-500/60" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300 dark:to-stone-700" />
            </div>
          </div>
        </header>

        {/* Drop Cap Effect - First Letter Styling via Content */}
        <div className="prose-drop-cap">
          {renderContent(content)}
        </div>

        {/* Timeline */}
        {chapter.timeline && chapter.timeline.length > 0 && (
          <section className="mt-20 pt-12 border-t border-stone-200/60 dark:border-stone-800/60">
            <h3 className="flex items-center gap-3 font-serif text-xl text-stone-800 dark:text-stone-200 mb-8">
              <Clock className="h-5 w-5 text-amber-600" />
              Timeline
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 dark:from-amber-700 dark:via-amber-600 dark:to-amber-700" />

              <div className="space-y-6">
                {chapter.timeline.map((event: TimelineEvent, idx: number) => (
                  <div key={idx} className="relative flex gap-6 items-start">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0 w-4 h-4 rounded-full bg-amber-400 dark:bg-amber-600 border-4 border-amber-50 dark:border-stone-900 shadow-sm" />

                    {/* Content */}
                    <div className="flex-1 -mt-0.5">
                      <span className="font-mono text-sm text-amber-700 dark:text-amber-500">
                        {event.date}
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 mt-0.5">
                        {event.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Chapter Navigation */}
        <nav className="mt-20 pt-12 border-t border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center justify-between gap-4">
            {chapter.prevChapter ? (
              <Link href={`/story/${chapter.prevChapter}`} className="group flex-1">
                <div className="p-6 rounded-2xl bg-white/60 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/40 hover:border-amber-300/50 dark:hover:border-amber-700/50 hover:shadow-lg transition-all">
                  <p className="text-xs uppercase tracking-[0.1em] text-stone-400 dark:text-stone-600 mb-1">
                    Previous
                  </p>
                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-serif text-lg">
                      {chapter.prevChapter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {chapter.nextChapter ? (
              <Link href={`/story/${chapter.nextChapter}`} className="group flex-1">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-100/80 to-amber-50/80 dark:from-amber-900/30 dark:to-stone-800/50 border border-amber-200/60 dark:border-amber-800/40 hover:shadow-lg transition-all text-right">
                  <p className="text-xs uppercase tracking-[0.1em] text-amber-600/80 dark:text-amber-500/80 mb-1">
                    Continue Reading
                  </p>
                  <div className="flex items-center justify-end gap-2 text-amber-800 dark:text-amber-400 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
                    <span className="font-serif text-lg">
                      {chapter.nextChapter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </nav>
      </article>
    </div>
  );
}
