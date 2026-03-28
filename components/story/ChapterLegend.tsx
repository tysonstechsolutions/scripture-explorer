// components/story/ChapterLegend.tsx
// A legend/key that appears at the start of chapters explaining important terms

'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { GLOSSARY, type GlossaryTerm } from '@/lib/story/glossary';

interface ChapterLegendProps {
  // Terms to highlight for this chapter
  terms?: string[];
}

// Default essential terms that should always be explained
const ESSENTIAL_TERMS = ['BCE', 'CE'];

export function ChapterLegend({ terms = [] }: ChapterLegendProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Combine essential terms with chapter-specific terms
  const allTerms = [...new Set([...ESSENTIAL_TERMS, ...terms])];
  const termEntries = allTerms
    .map(term => GLOSSARY[term])
    .filter((entry): entry is GlossaryTerm => entry !== undefined);

  if (termEntries.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 rounded-sm overflow-hidden border border-amber-800/20 dark:border-amber-700/30">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-4 p-4 bg-amber-100/60 dark:bg-amber-900/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-sm bg-amber-800/10 dark:bg-amber-700/20">
            <HelpCircle className="h-5 w-5 text-amber-800 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-amber-900 dark:text-amber-100">
              Quick Reference
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              New to these terms? Here&apos;s what they mean.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 text-amber-700 dark:text-amber-400">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border-t border-amber-800/10 dark:border-amber-700/20">
          <div className="grid gap-4 md:grid-cols-2">
            {termEntries.map((entry) => (
              <div
                key={entry.term}
                className="p-3 rounded-sm bg-amber-100/50 dark:bg-amber-900/20 border border-amber-800/10 dark:border-amber-700/20"
              >
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-amber-700 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-serif font-bold text-amber-900 dark:text-amber-100">
                      {entry.term}
                    </span>
                    <p className="text-sm text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                      {entry.definition}
                    </p>
                    {entry.example && (
                      <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 italic">
                        {entry.example}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dating system visual explanation */}
          {allTerms.includes('BCE') && (
            <div className="mt-6 p-4 rounded-sm bg-amber-100/70 dark:bg-amber-900/30 border border-amber-800/15 dark:border-amber-700/25">
              <h4 className="font-serif font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                <span className="text-lg">📅</span>
                Understanding Dates
              </h4>
              <div className="relative">
                {/* Timeline visual */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-amber-600 dark:text-amber-500 mb-1">Earlier</div>
                    <div className="text-sm font-mono text-amber-800 dark:text-amber-300">3000 BCE</div>
                  </div>
                  <div className="flex-1 h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full relative mx-2">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-4 h-4 rounded-full bg-amber-50 border-2 border-amber-600 dark:border-amber-400" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-amber-600 dark:text-amber-500 mb-1">Later</div>
                    <div className="text-sm font-mono text-amber-800 dark:text-amber-300">2024 CE</div>
                  </div>
                </div>
                <div className="text-center text-xs text-amber-700 dark:text-amber-400">
                  Year 1 (center point)
                </div>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-4 leading-relaxed">
                Think of it like a number line: <strong>BCE dates count backwards</strong> from year 1
                (so 3000 BCE was 3000 years before year 1), and <strong>CE dates count forward</strong>
                (we&apos;re in 2024 CE now). The bigger the BCE number, the further back in time!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
