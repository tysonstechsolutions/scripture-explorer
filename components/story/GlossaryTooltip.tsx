// components/story/GlossaryTooltip.tsx
// Tooltip that explains unfamiliar terms

'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { getGlossaryTerm } from '@/lib/story/glossary';

interface GlossaryTooltipProps {
  term: string;
  children: React.ReactNode;
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const glossaryEntry = getGlossaryTerm(term);

  if (!glossaryEntry) {
    return <>{children}</>;
  }

  return (
    <span className="relative inline-block">
      <span
        role="button"
        tabIndex={0}
        className="inline-flex items-center gap-1 border-b border-dashed border-amber-700/40 dark:border-amber-500/40 cursor-help hover:border-amber-800 dark:hover:border-amber-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
          if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
        <HelpCircle className="inline h-3 w-3 text-amber-700/50 dark:text-amber-500/50" />
      </span>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Tooltip */}
          <div
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 md:w-80"
            role="tooltip"
          >
            <div
              className="rounded-sm p-4 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(35, 40%, 92%) 0%, hsl(38, 35%, 88%) 100%)',
                border: '1px solid rgba(139, 90, 43, 0.3)',
                boxShadow: '0 4px 20px rgba(80, 50, 20, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              }}
            >
              {/* Term header */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-800/20">
                <span className="font-serif font-bold text-amber-900 text-lg">
                  {glossaryEntry.term}
                </span>
              </div>

              {/* Definition */}
              <p className="text-amber-950/90 text-sm leading-relaxed mb-2">
                {glossaryEntry.definition}
              </p>

              {/* Example if available */}
              {glossaryEntry.example && (
                <p className="text-amber-800/70 text-xs italic mt-2 pt-2 border-t border-amber-800/10">
                  Example: {glossaryEntry.example}
                </p>
              )}
            </div>

            {/* Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid hsl(38, 35%, 88%)',
              }}
            />
          </div>
        </>
      )}
    </span>
  );
}
