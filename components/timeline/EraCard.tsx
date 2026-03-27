"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Era } from "@/lib/timeline/types";

interface EraCardProps {
  era: Era;
}

export function EraCard({ era }: EraCardProps) {
  return (
    <Link
      href={`/timeline/${era.id}`}
      className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${era.name}, ${era.dateRange}`}
    >
      <Card className="hover:bg-parchment-200 dark:hover:bg-muted/50 transition-colors h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full ${era.color} mt-1.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-body-sm font-semibold text-leather-700">{era.order}.</span>
                <h3 className="text-body font-medium truncate">{era.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{era.dateRange}</p>
              <p className="text-body-sm text-foreground line-clamp-2">{era.tldr}</p>
              {era.bibleBooks.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2 truncate">
                  {era.bibleBooks.slice(0, 3).join(", ")}
                  {era.bibleBooks.length > 3 && ` +${era.bibleBooks.length - 3} more`}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
