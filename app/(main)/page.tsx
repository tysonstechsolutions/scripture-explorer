// app/(main)/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Badge } from '@/components/ui/badge';
import {
  Scroll,
  ArrowRight,
  BookOpen,
  Clock,
  Settings,
} from 'lucide-react';
import { getAllChapters } from '@/lib/story/chapters';
import { STORY_ERAS } from '@/lib/story/types';

export default function HomePage() {
  const { preferences } = usePreferences();
  const { isAdmin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.replace('/onboarding');
    }
  }, [preferences.hasCompletedOnboarding, router]);

  if (!preferences.hasCompletedOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#1C1612]">
        <div className="text-[#8C7B68]">Loading...</div>
      </main>
    );
  }

  const chapters = getAllChapters();
  const availableEras = STORY_ERAS.filter(era =>
    chapters.some(c => c.era === era.id)
  );
  const upcomingEras = STORY_ERAS.filter(era =>
    !chapters.some(c => c.era === era.id)
  );

  return (
    <div className="min-h-screen bg-[#1C1612]">
      {/* Admin bar */}
      {isAdmin && (
        <div className="relative z-10 px-4 pt-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-[#3A3028] bg-[#271F18]/60">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Admin</Badge>
              <Link href="/admin" className="text-sm text-[#8C7B68] hover:text-[#D5C4AF]">
                Manage Content
              </Link>
            </div>
            <Link href="/admin">
              <Settings className="h-4 w-4 text-[#8C7B68]" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative pt-16 pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4A3F33]" />
            <Scroll className="h-8 w-8 text-emerald-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4A3F33]" />
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight text-[#E8DCC8] mb-4">
            Scripture Explorer
          </h1>

          <p className="font-serif text-lg md:text-xl text-[#8C7B68] max-w-lg mx-auto leading-relaxed italic">
            The story of the Bible&mdash;told from beginning to end. Explore the evidence. Follow the history. Draw your own conclusions.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#4A3F33]" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#4A3F33]" />
          </div>
        </div>
      </header>

      {/* Start / Continue the Story */}
      {chapters.length > 0 && (
        <section className="px-4 pb-8">
          <div className="max-w-2xl mx-auto">
            <Link href={`/story/${chapters[0].slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-[#271F18] p-8 shadow-xl border border-emerald-800/30">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)"/%3E%3C/svg%3E")',
                  }} />
                </div>

                <div className="relative">
                  <p className="text-emerald-400/80 text-sm uppercase tracking-[0.2em] mb-3">
                    Begin the Journey
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">
                    {chapters[0].title}
                  </h2>
                  <p className="text-emerald-200/60 mb-5 max-w-lg">
                    Before there was Israel, before Abraham, there was a world already ancient, already wrestling with eternal questions.
                  </p>
                  <div className="inline-flex items-center gap-2 text-emerald-400 group-hover:text-white transition-colors">
                    <span className="font-medium">Start Reading</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* AI Feature Teaser */}
      <section className="px-4 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#271F18] border border-[#3A3028]">
            <div className="w-9 h-9 rounded-full bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-emerald-400">WT</span>
            </div>
            <p className="text-sm text-[#8C7B68] leading-relaxed">
              <span className="text-[#D5C4AF] font-medium">Wes Tament</span> is your built-in debate partner. Highlight any passage while reading to discuss it with an apologetics scholar.
            </p>
          </div>
        </div>
      </section>

      {/* Story Chapters */}
      <section className="px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            <h2 className="font-serif text-xl text-[#E8DCC8]">
              The Story So Far
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#3A3028] to-transparent" />
          </div>

          <div className="space-y-8">
            {availableEras.map(era => {
              const eraChapters = chapters.filter(c => c.era === era.id);
              return (
                <div key={era.id}>
                  <div className="flex items-baseline gap-3 mb-3">
                    <h3 className="font-serif text-lg text-[#D5C4AF]">
                      {era.name}
                    </h3>
                    <span className="text-xs text-[#6B5D4F] font-mono">
                      {era.range}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {eraChapters.map(chapter => (
                      <Link key={chapter.id} href={`/story/${chapter.slug}`} className="group block">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#271F18] border border-[#3A3028] hover:bg-[#332A21] hover:border-emerald-700/30 hover:shadow-md transition-all duration-300">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-700/30">
                            <span className="font-serif text-emerald-400">
                              {chapter.order}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-[#D5C4AF] group-hover:text-emerald-400 transition-colors">
                              {chapter.title}
                            </h4>
                          </div>
                          <ArrowRight className="flex-shrink-0 h-4 w-4 text-[#4A3F33] group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Coming Soon */}
            {upcomingEras.length > 0 && (
              <div className="pt-4 border-t border-[#3A3028]">
                <p className="text-xs uppercase tracking-[0.15em] text-[#6B5D4F] mb-4 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Coming Soon
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {upcomingEras.slice(0, 6).map(era => (
                    <div
                      key={era.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#231C15] border border-[#3A3028]/60"
                    >
                      <span className="text-sm text-[#6B5D4F] truncate">{era.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
