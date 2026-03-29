// app/(main)/story/page.tsx

import Link from 'next/link';
import { ArrowRight, Scroll, Clock, BookOpen } from 'lucide-react';
import { getAllChapters } from '@/lib/story/chapters';
import { STORY_ERAS } from '@/lib/story/types';

export const metadata = {
  title: 'The Story | Scripture Explorer',
  description: 'Journey through biblical history from creation to the early church',
};

export default function StoryPage() {
  const chapters = getAllChapters();

  const chaptersByEra = STORY_ERAS.map(era => ({
    era,
    chapters: chapters.filter(c => c.era === era.id),
  })).filter(group => group.chapters.length > 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-stone-950">
      {/* Hero Section */}
      <header className="relative pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300 dark:to-stone-600" />
            <Scroll className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300 dark:to-stone-600" />
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-stone-800 dark:text-stone-100 mb-6">
            The Story
          </h1>

          <p className="font-serif text-xl md:text-2xl text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed italic">
            A journey through four thousand years of sacred history&mdash;from ancient Mesopotamia to the formation of the church.
          </p>

          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-stone-300 dark:to-stone-700" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600/60" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-stone-300 dark:to-stone-700" />
          </div>
        </div>
      </header>

      {/* Start Reading CTA */}
      {chapters.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-2xl mx-auto">
            <Link href={`/story/${chapters[0].slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-stone-800 p-8 md:p-12 shadow-xl">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)"/%3E%3C/svg%3E")',
                  }} />
                </div>

                <div className="relative">
                  <p className="text-emerald-300/80 text-sm uppercase tracking-[0.2em] mb-3">
                    Begin Your Journey
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                    {chapters[0].title}
                  </h2>
                  <p className="text-emerald-100/70 text-lg mb-6 max-w-lg">
                    Before there was Israel, before Abraham, there was a world already ancient, already wrestling with eternal questions.
                  </p>
                  <div className="inline-flex items-center gap-2 text-emerald-300 group-hover:text-white transition-colors">
                    <span className="font-medium">Start Reading</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Chapters by Era */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <BookOpen className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-200">
              Chapters
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-stone-200 dark:from-stone-800 to-transparent" />
          </div>

          <div className="space-y-12">
            {chaptersByEra.map(({ era, chapters: eraChapters }) => (
              <div key={era.id} className="relative">
                <div className="flex items-baseline gap-4 mb-4">
                  <h3 className="font-serif text-xl text-stone-700 dark:text-stone-300">
                    {era.name}
                  </h3>
                  <span className="text-sm text-stone-400 dark:text-stone-600 font-mono">
                    {era.range}
                  </span>
                </div>

                <div className="space-y-3">
                  {eraChapters.map((chapter) => (
                    <Link key={chapter.id} href={`/story/${chapter.slug}`} className="group block">
                      <div className="relative flex items-center gap-6 p-5 rounded-xl bg-white/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/40 hover:bg-white dark:hover:bg-stone-800/60 hover:border-emerald-300/50 hover:shadow-md transition-all duration-300">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-700/40">
                          <span className="font-serif text-lg text-emerald-700 dark:text-emerald-400">
                            {chapter.order}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-lg text-stone-700 dark:text-stone-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {chapter.title}
                          </h4>
                          {chapter.timeline && chapter.timeline.length > 0 && (
                            <p className="text-sm text-stone-400 dark:text-stone-500 mt-0.5">
                              {chapter.timeline[0].date} &mdash; {chapter.timeline[chapter.timeline.length - 1].date}
                            </p>
                          )}
                        </div>

                        <ArrowRight className="flex-shrink-0 h-5 w-5 text-stone-300 dark:text-stone-600 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Coming Soon */}
            <div className="pt-8 border-t border-stone-200/60 dark:border-stone-800/60">
              <p className="text-sm uppercase tracking-[0.15em] text-stone-400 dark:text-stone-600 mb-6 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Coming Soon
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {STORY_ERAS.filter(era => !chaptersByEra.find(g => g.era.id === era.id)).map(era => (
                  <div
                    key={era.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/40 dark:bg-stone-800/20 border border-stone-200/40 dark:border-stone-800/40"
                  >
                    <span className="text-stone-400 dark:text-stone-500">{era.name}</span>
                    <span className="text-xs text-stone-400 dark:text-stone-600 font-mono">
                      {era.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="relative p-8 md:p-10 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60">
            <div className="relative">
              <h3 className="font-serif text-xl text-stone-800 dark:text-stone-200 mb-4">
                About This Journey
              </h3>
              <div className="space-y-3 text-stone-500 dark:text-stone-400 leading-relaxed">
                <p>
                  This isn&apos;t a devotional or a sermon series. It&apos;s an honest exploration of biblical history&mdash;including the parts that are complicated, debated, or often glossed over.
                </p>
                <p>
                  Every scripture reference is clickable. Every claim is explorable. Follow your curiosity wherever it leads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
