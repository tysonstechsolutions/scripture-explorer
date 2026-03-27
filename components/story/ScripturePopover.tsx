// components/story/ScripturePopover.tsx

'use client';

import { useState } from 'react';
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
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
    if (verseData) return; // Already loaded

    setLoading(true);
    setError(null);

    try {
      // Parse reference to create API-friendly format
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

  // Parse reference for link
  const linkRef = reference.toLowerCase().replace(/\s+/g, '-').replace(/:/g, '-');

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline decoration-dotted underline-offset-2 cursor-pointer font-medium">
          <BookOpen className="h-3 w-3" />
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{reference}</h4>
            <Link href={`/read/${linkRef}`}>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Read in context
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            {loading && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {verseData && (
              <p className="italic leading-relaxed">{verseData.text}</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
