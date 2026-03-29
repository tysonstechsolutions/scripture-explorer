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
    <div className="mb-12 rounded-lg overflow-hidden border border-[#3A3028]">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-4 p-4 bg-[#271F18] hover:bg-[#332A21] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-900/30">
            <HelpCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-[#E8DCC8]">
              Quick Reference
            </h3>
            <p className="text-sm text-[#8C7B68]">
              New to these terms? Here&apos;s what they mean.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 text-[#8C7B68]">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="p-4 bg-[#231C15] border-t border-[#3A3028]">
          <div className="grid gap-4 md:grid-cols-2">
            {termEntries.map((entry) => (
              <div
                key={entry.term}
                className="p-3 rounded-lg bg-[#271F18] border border-[#3A3028]"
              >
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-serif font-bold text-[#E8DCC8]">
                      {entry.term}
                    </span>
                    <p className="text-sm text-[#D5C4AF] mt-1 leading-relaxed">
                      {entry.definition}
                    </p>
                    {entry.example && (
                      <p className="text-xs text-[#8C7B68] mt-2 italic">
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
            <div className="mt-6 p-4 rounded-lg bg-[#271F18] border border-[#3A3028]">
              <h4 className="font-serif font-semibold text-[#E8DCC8] mb-3 flex items-center gap-2">
                <span className="text-lg">📅</span>
                Understanding Dates
              </h4>
              <div className="relative">
                {/* Timeline visual */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-[#8C7B68] mb-1">Earlier</div>
                    <div className="text-sm font-mono text-[#D5C4AF]">3000 BCE</div>
                  </div>
                  <div className="flex-1 h-2 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-700 rounded-full relative mx-2">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-4 h-4 rounded-full bg-[#1C1612] border-2 border-emerald-500" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[#8C7B68] mb-1">Later</div>
                    <div className="text-sm font-mono text-[#D5C4AF]">2024 CE</div>
                  </div>
                </div>
                <div className="text-center text-xs text-[#8C7B68]">
                  Year 1 (center point)
                </div>
              </div>
              <p className="text-sm text-[#D5C4AF] mt-4 leading-relaxed">
                Think of it like a number line: <strong className="text-[#E8DCC8]">BCE dates count backwards</strong> from year 1
                (so 3000 BCE was 3000 years before year 1), and <strong className="text-[#E8DCC8]">CE dates count forward</strong>
                (we&apos;re in 2024 CE now). The bigger the BCE number, the further back in time!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
