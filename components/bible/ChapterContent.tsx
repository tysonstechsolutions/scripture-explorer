"use client";

interface ChapterContentProps {
  content: string;
  reference: string;
}

export function ChapterContent({ content, reference }: ChapterContentProps) {
  // Parse the plain text content into verses
  // API.Bible returns text with verse numbers like "[1] In the beginning..."
  const lines = content.split("\n").filter((line) => line.trim());

  return (
    <article className="prose prose-lg max-w-none">
      <div className="text-body-sm text-muted-foreground mb-4">{reference}</div>
      <div className="verse-text space-y-4">
        {lines.map((line, index) => {
          // Extract verse number if present
          const verseMatch = line.match(/^\[(\d+)\]\s*/);
          const verseNum = verseMatch ? verseMatch[1] : null;
          const text = verseMatch ? line.replace(/^\[\d+\]\s*/, "") : line;

          return (
            <p key={index} className="text-body leading-relaxed">
              {verseNum && (
                <sup className="verse-number text-leather-500 font-sans mr-1">
                  {verseNum}
                </sup>
              )}
              {text}
            </p>
          );
        })}
      </div>
    </article>
  );
}
