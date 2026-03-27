// app/(main)/story/page.tsx

import Link from 'next/link';
import { Book, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllChapters } from '@/lib/story/chapters';
import { STORY_ERAS } from '@/lib/story/types';

export const metadata = {
  title: 'The Story | Scripture Explorer',
  description: 'Journey through biblical history from creation to the early church',
};

export default function StoryPage() {
  const chapters = getAllChapters();

  // Group chapters by era
  const chaptersByEra = STORY_ERAS.map(era => ({
    era,
    chapters: chapters.filter(c => c.era === era.id),
  })).filter(group => group.chapters.length > 0);

  return (
    <div className="container max-w-4xl py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Book className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">The Story</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Journey through 4,000 years of biblical history—from the ancient Near East
          to the formation of the church. Not just what happened, but why it matters.
        </p>
      </div>

      {/* Start Reading CTA */}
      {chapters.length > 0 && (
        <Card className="mb-12 bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Start from the Beginning</h2>
              <p className="text-muted-foreground">
                Chapter 1: {chapters[0].title}
              </p>
            </div>
            <Link href={`/story/${chapters[0].slug}`}>
              <Button size="lg">
                Begin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Chapters by Era */}
      <div className="space-y-8">
        {chaptersByEra.map(({ era, chapters: eraChapters }) => (
          <div key={era.id}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold">{era.name}</h2>
              <Badge variant="outline" className="text-xs">
                {era.range}
              </Badge>
            </div>

            <div className="grid gap-3">
              {eraChapters.map(chapter => (
                <Link key={chapter.id} href={`/story/${chapter.slug}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium flex items-center gap-3">
                          <span className="text-muted-foreground text-sm">
                            {chapter.order}.
                          </span>
                          {chapter.title}
                        </CardTitle>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Coming Soon Section */}
        <div className="border-t pt-8 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
            Coming Soon
          </h2>
          <div className="grid gap-2 text-muted-foreground">
            {STORY_ERAS.filter(era => !chaptersByEra.find(g => g.era.id === era.id)).map(era => (
              <div key={era.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <Clock className="h-4 w-4" />
                <span>{era.name}</span>
                <Badge variant="outline" className="text-xs ml-auto">
                  {era.range}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About This Journey */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-3">About This Journey</h2>
          <div className="text-muted-foreground space-y-2">
            <p>
              This isn&apos;t a devotional or a sermon series. It&apos;s an honest exploration
              of biblical history—including the parts that are complicated, debated, or
              often glossed over.
            </p>
            <p>
              You&apos;ll learn about the world the Bible emerged from, why certain books
              were included (and others weren&apos;t), how Judaism and Christianity diverged,
              and how we got the Bible we have today.
            </p>
            <p>
              Every scripture reference is clickable. Every claim is explorable.
              Follow your curiosity wherever it leads.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
