// components/story/ScripturePopover.tsx

'use client';

import { useState } from 'react';
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';

interface ScripturePopoverProps {
  reference: string;
  children: React.ReactNode;
}

interface VerseData {
  text: string;
  reference: string;
}

export function ScripturePopover({ reference, children }: ScripturePopoverProps) {
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchVerse = async () => {
    if (verseData) return;

    setLoading(true);
    setError(null);

    try {
      const apiRef = reference.replace(/\s+/g, '+');
      const response = await fetch(
        `https://bible-api.com/${apiRef}?translation=kjv`
      );

      if (!response.ok) throw new Error('Failed to fetch verse');

      const data = await response.json();
      setVerseData({
        text: data.text?.trim() || 'Verse not found',
        reference: data.reference || reference,
      });
    } catch {
      setError('Could not load verse');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchVerse();
    }
  };

  const linkRef = reference.toLowerCase().replace(/\s+/g, '-').replace(/:/g, '-');

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-500 hover:text-amber-900 dark:hover:text-amber-400 underline decoration-amber-400/40 dark:decoration-amber-600/40 decoration-dotted underline-offset-4 cursor-pointer transition-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenChange(true);
            }
          }}
        >
          <BookOpen className="h-3.5 w-3.5" />
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 overflow-hidden bg-gradient-to-br from-amber-50 to-stone-50 dark:from-stone-900 dark:to-stone-950 border-amber-200/60 dark:border-amber-800/40 shadow-xl"
        align="start"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-100/80 to-amber-50/80 dark:from-amber-900/30 dark:to-stone-900/50 border-b border-amber-200/40 dark:border-amber-800/30">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg text-amber-900 dark:text-amber-300 font-medium">
              {reference}
            </h4>
            <Link
              href={`/read/${linkRef}`}
              className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
            >
              <span>Read in context</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-6 text-amber-600/70">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading passage...</span>
            </div>
          )}

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm py-4 text-center">
              {error}
            </p>
          )}

          {verseData && (
            <div className="relative">
              {/* Decorative quote */}
              <div className="absolute -left-2 -top-2 text-4xl font-serif text-amber-200/60 dark:text-amber-700/40 leading-none select-none">
                &ldquo;
              </div>
              <p className="font-serif text-base text-stone-700 dark:text-stone-300 leading-relaxed italic pl-4">
                {verseData.text}
              </p>
            </div>
          )}
        </div>

        {/* Footer accent */}
        <div className="h-1 bg-gradient-to-r from-amber-300/60 via-amber-400/60 to-amber-300/60 dark:from-amber-700/40 dark:via-amber-600/40 dark:to-amber-700/40" />
      </PopoverContent>
    </Popover>
  );
}
