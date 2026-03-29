// components/story/StoryChapter.tsx
// Warm, comfortable reading experience

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { ScripturePopover } from './ScripturePopover';
import { StoryImage } from './StoryImage';
import { ChapterLegend } from './ChapterLegend';
import { KeyInsight } from './KeyInsight';
import { SelectionToolbar } from './SelectionToolbar';
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
          <div key={idx} className="mt-20 mb-10 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300 dark:to-stone-600" />
              <div className="text-stone-400 dark:text-stone-500 text-xl">&#10022;</div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300 dark:to-stone-600" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-stone-800 dark:text-stone-100 text-center tracking-wide">
              {title}
            </h2>
          </div>
        );
      }

      // Scripture blocks with full quote
      if (section.startsWith('{scripture:')) {
        const match = section.match(/\{scripture:([^}]+)\}\s*>\s*([\s\S]+)/);
        if (match) {
          const [, reference, text] = match;
          return (
            <figure key={idx} className="my-14 relative animate-fade-in">
              <blockquote className="relative bg-stone-100/80 dark:bg-stone-800/50 rounded-lg p-8 border-l-4 border-emerald-700/60 dark:border-emerald-500/60 shadow-sm">
                <div className="absolute -top-2 -left-1 text-emerald-700/20 dark:text-emerald-400/20 text-5xl leading-none select-none font-serif">&ldquo;</div>
                <p className="relative font-serif text-xl md:text-2xl text-stone-700 dark:text-stone-200 leading-relaxed italic">
                  {text.trim()}
                </p>
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-2 justify-end">
                <BookOpen className="h-4 w-4 text-emerald-700/70 dark:text-emerald-400" />
                <ScripturePopover reference={reference}>
                  <span className="font-serif font-semibold text-emerald-800 dark:text-emerald-400 text-base tracking-wide">{reference}</span>
                </ScripturePopover>
              </figcaption>
            </figure>
          );
        }
      }

      // Image markers
      if (section.includes('{image:')) {
        const match = section.match(/\{image:([^}]+)\}/);
        if (match) {
          const imageId = match[1];
          const imageData = getStoryImage(imageId);
          if (imageData) {
            return (
              <div key={idx} className="animate-fade-in my-12">
                <StoryImage
                  src={imageData.src}
                  alt={imageData.alt}
                  caption={imageData.caption}
                  credit={imageData.credit}
                />
              </div>
            );
          }
        }
      }

      // Key insight callouts
      if (section.includes('{insight:')) {
        const match = section.match(/\{insight:(\w+)\}\s*([\s\S]+)/);
        if (match) {
          const [, type, text] = match;
          const validTypes = ['love', 'truth', 'revelation', 'key'] as const;
          const insightType = validTypes.includes(type as typeof validTypes[number])
            ? (type as typeof validTypes[number])
            : 'key';
          return (
            <KeyInsight key={idx} type={insightType}>
              {text.trim()}
            </KeyInsight>
          );
        }
      }

      // Deep-dive markers
      if (section.includes('{deep-dive:')) {
        const parts = section.split(/(\{deep-dive:[^}]+\})/);
        return (
          <p key={idx} className="font-serif text-lg md:text-xl text-stone-700 dark:text-stone-200 leading-[1.9] mb-6">
            {parts.map((part, partIdx) => {
              const deepDiveMatch = part.match(/\{deep-dive:([^}]+)\}/);
              if (deepDiveMatch) {
                const deepDiveId = deepDiveMatch[1];
                return (
                  <span
                    key={partIdx}
                    role="button"
                    tabIndex={0}
                    className="inline-flex items-center gap-2 px-4 py-2 ml-2 rounded-lg bg-emerald-700 dark:bg-emerald-600 text-white text-sm font-sans font-semibold shadow-sm hover:shadow-md hover:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
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
                    <Compass className="h-4 w-4" />
                    Go Deeper
                    <ArrowRight className="h-3 w-3" />
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
          <p key={idx} className="font-serif text-lg md:text-xl text-stone-700 dark:text-stone-200 leading-[1.9] mb-6">
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

      // Map markers
      if (section.includes('{map:')) {
        return (
          <div key={idx} className="my-12 rounded-lg bg-stone-100/60 dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700 p-8 text-center animate-fade-in">
            <Compass className="h-12 w-12 mx-auto text-stone-400 dark:text-stone-500 mb-3" />
            <p className="text-stone-500 dark:text-stone-400 font-serif italic">Interactive map coming soon</p>
          </div>
        );
      }

      // Skip navigation markers
      if (section.includes('{next-chapter:') || section.includes('{prev-chapter:')) {
        return null;
      }

      // Regular paragraphs - with emphasis handling
      if (section.trim()) {
        const processedText = section.split(/(\*[^*]+\*)/g).map((part, i) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="text-emerald-800 dark:text-emerald-400 font-medium not-italic">{part.slice(1, -1)}</em>;
          }
          return part;
        });

        return (
          <p key={idx} className="font-serif text-lg md:text-xl text-stone-700 dark:text-stone-200 leading-[1.9] mb-6 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-stone-500 dark:first-letter:text-stone-400">
            {processedText}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Highlight-to-AI feature */}
      <SelectionToolbar chapterTitle={chapter.title} />

      {/* Warm cream background */}
      <div
        className="fixed inset-0 -z-10 bg-[#FAF7F2] dark:bg-stone-950"
      />

      {/* Very subtle texture */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <article className="relative max-w-3xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-all group mb-10 shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Story</span>
        </Link>

        {/* Chapter Header */}
        <header className="mb-16 text-center animate-fade-in">
          {/* Era Badge */}
          {era && (
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 mb-8">
              <span className="font-serif font-semibold text-emerald-800 dark:text-emerald-300 tracking-wide text-sm">
                {era.name}
              </span>
              <span className="text-emerald-400 dark:text-emerald-600">&#8226;</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
                {era.range}
              </span>
            </div>
          )}

          {/* Chapter Number */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-stone-300 dark:to-stone-600" />
            <span className="text-stone-400 dark:text-stone-500 uppercase tracking-[0.4em] text-xs font-bold font-sans">
              Chapter {chapter.order}
            </span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-stone-300 dark:to-stone-600" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 dark:text-stone-50 mb-10 leading-tight tracking-tight">
            {chapter.title}
          </h1>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-stone-300 dark:bg-stone-600" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600/60 dark:bg-emerald-400/60" />
            <div className="h-px w-12 bg-stone-300 dark:bg-stone-600" />
          </div>
        </header>

        {/* Quick Reference Legend */}
        <ChapterLegend terms={chapter.glossaryTerms} />

        {/* Content */}
        <div className="space-y-2">
          {renderContent(content)}
        </div>

        {/* Timeline */}
        {chapter.timeline && chapter.timeline.length > 0 && (
          <section className="mt-24 pt-12 border-t border-stone-200 dark:border-stone-700 animate-fade-in">
            <h3 className="flex items-center justify-center gap-3 font-serif text-2xl font-bold text-stone-800 dark:text-stone-100 mb-12">
              <Clock className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
              Timeline
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-300 via-emerald-200 to-emerald-300 dark:from-emerald-700 dark:via-emerald-800 dark:to-emerald-700" />

              <div className="space-y-6">
                {chapter.timeline.map((event: TimelineEvent, idx: number) => (
                  <div key={idx} className="relative flex gap-6 items-start group">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600 border-3 border-[#FAF7F2] dark:border-stone-950 shadow-sm group-hover:scale-110 transition-transform" />

                    {/* Content card */}
                    <div className="flex-1 -mt-1 p-4 rounded-lg bg-white/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/50 group-hover:bg-white dark:group-hover:bg-stone-800/60 group-hover:shadow-sm transition-all">
                      <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-mono text-sm font-bold mb-2 tracking-wide">
                        {event.date}
                      </span>
                      <p className="text-stone-700 dark:text-stone-200 font-serif">
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
        <nav className="mt-24 pt-12 border-t border-stone-200 dark:border-stone-700">
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            {chapter.prevChapter ? (
              <Link href={`/story/${chapter.prevChapter}`} className="group flex-1">
                <div className="h-full p-6 rounded-lg bg-white/70 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800/60 hover:shadow-md transition-all">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 font-bold mb-2 flex items-center gap-2">
                    <ChevronLeft className="h-3 w-3" />
                    Previous
                  </p>
                  <p className="font-serif text-lg text-stone-700 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                    {chapter.prevChapter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {chapter.nextChapter && (
              <Link href={`/story/${chapter.nextChapter}`} className="group flex-1">
                <div className="h-full p-6 rounded-lg bg-emerald-700 dark:bg-emerald-600 text-white shadow-md hover:shadow-lg hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200 font-bold mb-2 flex items-center justify-end gap-2">
                    Continue Reading
                    <ChevronRight className="h-3 w-3" />
                  </p>
                  <p className="font-serif text-xl font-semibold text-right">
                    {chapter.nextChapter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </div>
  );
}
