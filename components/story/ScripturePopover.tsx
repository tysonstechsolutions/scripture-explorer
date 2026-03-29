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
      <PopoverTrigger
        className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 underline decoration-emerald-600/40 decoration-dotted underline-offset-4 cursor-pointer transition-colors"
      >
        <BookOpen className="h-3.5 w-3.5" />
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 overflow-hidden bg-[#271F18] border-[#3A3028] shadow-xl"
        align="start"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#231C15] border-b border-[#3A3028]">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg text-emerald-400 font-medium">
              {reference}
            </h4>
            <Link
              href={`/read/${linkRef}`}
              className="inline-flex items-center gap-1 text-xs text-[#8C7B68] hover:text-[#D5C4AF] transition-colors"
            >
              <span>Read in context</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-6 text-[#8C7B68]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading passage...</span>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm py-4 text-center">
              {error}
            </p>
          )}

          {verseData && (
            <div className="relative">
              {/* Decorative quote */}
              <div className="absolute -left-2 -top-2 text-4xl font-serif text-emerald-700/30 leading-none select-none">
                &ldquo;
              </div>
              <p className="font-serif text-base text-[#D5C4AF] leading-relaxed italic pl-4">
                {verseData.text}
              </p>
            </div>
          )}
        </div>

        {/* Footer accent */}
        <div className="h-1 bg-gradient-to-r from-emerald-800/40 via-emerald-600/40 to-emerald-800/40" />
      </PopoverContent>
    </Popover>
  );
}
