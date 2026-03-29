// components/story/StoryChapter.tsx
// Ancient Manuscript Design: Papyrus, weathered, aged parchment aesthetic

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
            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-900/40 to-amber-800/60" />
              <div className="text-amber-800/60 text-2xl">&#10022;</div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-amber-900/40 to-amber-800/60" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-amber-950 dark:text-amber-100 text-center tracking-wide">
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
              {/* Aged paper inset effect */}
              <div className="absolute -inset-3 bg-amber-900/5 dark:bg-amber-400/5 rounded-sm"
                   style={{
                     boxShadow: 'inset 0 2px 8px rgba(120, 80, 40, 0.15), inset 0 -2px 8px rgba(120, 80, 40, 0.1)'
                   }}
              />

              {/* Decorative corner flourishes */}
              <div className="absolute -top-2 -left-2 text-amber-800/30 dark:text-amber-400/30 text-4xl leading-none select-none font-serif">&ldquo;</div>
              <div className="absolute -bottom-2 -right-2 text-amber-800/30 dark:text-amber-400/30 text-4xl leading-none select-none font-serif rotate-180">&ldquo;</div>

              <blockquote className="relative bg-gradient-to-br from-amber-100/80 via-amber-50/60 to-orange-100/40 dark:from-amber-950/60 dark:via-stone-900/40 dark:to-amber-950/30 rounded-sm p-8 border-l-4 border-amber-800/60 dark:border-amber-600/60">
                <p className="font-serif text-xl md:text-2xl text-amber-950 dark:text-amber-100 leading-relaxed italic">
                  {text.trim()}
                </p>
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-2 justify-end">
                <BookOpen className="h-4 w-4 text-amber-800/70 dark:text-amber-500" />
                <ScripturePopover reference={reference}>
                  <span className="font-serif font-semibold text-amber-800 dark:text-amber-400 text-base tracking-wide">{reference}</span>
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

      // Key insight callouts - comic book style
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
          <p key={idx} className="font-serif text-lg md:text-xl text-amber-950/90 dark:text-amber-100/90 leading-[1.9] mb-6">
            {parts.map((part, partIdx) => {
              const deepDiveMatch = part.match(/\{deep-dive:([^}]+)\}/);
              if (deepDiveMatch) {
                const deepDiveId = deepDiveMatch[1];
                return (
                  <span
                    key={partIdx}
                    role="button"
                    tabIndex={0}
                    className="inline-flex items-center gap-2 px-4 py-2 ml-2 rounded-sm bg-gradient-to-r from-amber-800 to-amber-900 dark:from-amber-700 dark:to-amber-800 text-amber-50 text-sm font-sans font-semibold shadow-md hover:shadow-lg hover:from-amber-700 hover:to-amber-800 active:scale-95 transition-all cursor-pointer border border-amber-700/50"
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
          <p key={idx} className="font-serif text-lg md:text-xl text-amber-950/90 dark:text-amber-100/90 leading-[1.9] mb-6">
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
          <div key={idx} className="my-12 rounded-sm bg-gradient-to-br from-amber-100/60 to-orange-100/40 dark:from-amber-950/40 dark:to-stone-900/30 border-2 border-amber-800/20 dark:border-amber-700/30 p-8 text-center animate-fade-in">
            <Compass className="h-12 w-12 mx-auto text-amber-800/60 dark:text-amber-500/60 mb-3" />
            <p className="text-amber-800 dark:text-amber-400 font-serif italic">Interactive map coming soon</p>
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
            return <em key={i} className="text-amber-800 dark:text-amber-400 font-medium not-italic">{part.slice(1, -1)}</em>;
          }
          return part;
        });

        return (
          <p key={idx} className="font-serif text-lg md:text-xl text-amber-950/90 dark:text-amber-100/90 leading-[1.9] mb-6 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-amber-800 dark:first-letter:text-amber-500">
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

      {/* Papyrus/Parchment Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            linear-gradient(180deg,
              hsl(35, 30%, 88%) 0%,
              hsl(38, 35%, 85%) 20%,
              hsl(40, 32%, 82%) 40%,
              hsl(36, 28%, 80%) 60%,
              hsl(34, 25%, 78%) 80%,
              hsl(32, 30%, 75%) 100%
            )
          `,
        }}
      />

      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 -z-10 opacity-40 dark:opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle stain/aging effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-900/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-900/15 to-transparent" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-amber-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-orange-900/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-amber-700/3 rounded-full blur-2xl" />
      </div>

      {/* Burnt/aged edges */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-amber-950/20 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-amber-950/20 to-transparent" />
      </div>

      {/* Dark mode override */}
      <div className="dark:fixed dark:inset-0 dark:-z-10 dark:bg-gradient-to-b dark:from-stone-950 dark:via-amber-950/20 dark:to-stone-950" />

      <article className="relative max-w-3xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <Link
          href="/story"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-amber-100/80 dark:bg-amber-900/40 border border-amber-800/20 dark:border-amber-700/30 text-amber-900 dark:text-amber-200 hover:bg-amber-200/80 dark:hover:bg-amber-800/40 transition-all group mb-10"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold uppercase tracking-widest">Back to Story</span>
        </Link>

        {/* Chapter Header */}
        <header className="mb-16 text-center animate-fade-in">
          {/* Era Badge */}
          {era && (
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-sm bg-amber-900/10 dark:bg-amber-800/30 border border-amber-800/30 dark:border-amber-600/40 mb-8">
              <span className="font-serif font-semibold text-amber-900 dark:text-amber-200 tracking-wide">
                {era.name}
              </span>
              <span className="text-amber-700 dark:text-amber-500">&#8226;</span>
              <span className="text-sm text-amber-800 dark:text-amber-400 font-mono tracking-wider">
                {era.range}
              </span>
            </div>
          )}

          {/* Chapter Number - Decorative */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-800/40 to-amber-800/60" />
            <span className="text-amber-800/70 dark:text-amber-500/70 uppercase tracking-[0.4em] text-xs font-bold font-sans">
              Chapter {chapter.order}
            </span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent via-amber-800/40 to-amber-800/60" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-amber-950 dark:text-amber-50 mb-10 leading-tight tracking-tight">
            {chapter.title}
          </h1>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-amber-800/40" />
            <div className="text-amber-800/50 dark:text-amber-500/50 text-lg">&#10040;</div>
            <div className="h-1 w-1 rounded-full bg-amber-800/60 dark:bg-amber-500/60" />
            <div className="text-amber-800/50 dark:text-amber-500/50 text-lg">&#10040;</div>
            <div className="h-px w-8 bg-amber-800/40" />
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
          <section className="mt-24 pt-12 border-t-2 border-amber-800/20 dark:border-amber-700/30 animate-fade-in">
            <h3 className="flex items-center justify-center gap-3 font-serif text-2xl font-bold text-amber-950 dark:text-amber-100 mb-12">
              <Clock className="h-6 w-6 text-amber-800/70 dark:text-amber-500" />
              Timeline
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-800/40 via-amber-700/30 to-amber-800/40 dark:from-amber-600/40 dark:via-amber-500/30 dark:to-amber-600/40" />

              <div className="space-y-6">
                {chapter.timeline.map((event: TimelineEvent, idx: number) => (
                  <div key={idx} className="relative flex gap-6 items-start group">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 dark:from-amber-500 dark:to-amber-700 border-3 border-amber-100 dark:border-stone-900 shadow-md group-hover:scale-110 transition-transform" />

                    {/* Content card */}
                    <div className="flex-1 -mt-1 p-4 rounded-sm bg-amber-100/50 dark:bg-amber-900/20 border border-amber-800/10 dark:border-amber-700/20 group-hover:bg-amber-100/80 dark:group-hover:bg-amber-900/30 transition-colors">
                      <span className="inline-block px-3 py-1 rounded-sm bg-amber-800/10 dark:bg-amber-700/30 text-amber-900 dark:text-amber-300 font-mono text-sm font-bold mb-2 tracking-wide">
                        {event.date}
                      </span>
                      <p className="text-amber-950 dark:text-amber-100 font-serif">
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
        <nav className="mt-24 pt-12 border-t-2 border-amber-800/20 dark:border-amber-700/30">
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            {chapter.prevChapter ? (
              <Link href={`/story/${chapter.prevChapter}`} className="group flex-1">
                <div className="h-full p-6 rounded-sm bg-amber-100/60 dark:bg-amber-900/30 border border-amber-800/20 dark:border-amber-700/30 hover:bg-amber-200/60 dark:hover:bg-amber-800/30 transition-all">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-500 font-bold mb-2 flex items-center gap-2">
                    <ChevronLeft className="h-3 w-3" />
                    Previous
                  </p>
                  <p className="font-serif text-lg text-amber-900 dark:text-amber-200 group-hover:text-amber-950 dark:group-hover:text-amber-100 transition-colors">
                    {chapter.prevChapter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {chapter.nextChapter && (
              <Link href={`/story/${chapter.nextChapter}`} className="group flex-1">
                <div className="h-full p-6 rounded-sm bg-gradient-to-br from-amber-800 to-amber-900 dark:from-amber-700 dark:to-amber-800 text-amber-50 border border-amber-700/50 shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-600 dark:hover:to-amber-700 transition-all">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-200 font-bold mb-2 flex items-center justify-end gap-2">
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
