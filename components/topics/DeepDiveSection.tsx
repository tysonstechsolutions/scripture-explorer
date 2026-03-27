// components/topics/DeepDiveSection.tsx

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DeepDiveSection as DeepDiveSectionType } from '@/lib/topics/types';

interface DeepDiveSectionProps {
  section: DeepDiveSectionType;
}

export function DeepDiveSection({ section }: DeepDiveSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-4 text-left h-auto"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold">{section.title}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0" />
        )}
      </Button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      )}
    </div>
  );
}
