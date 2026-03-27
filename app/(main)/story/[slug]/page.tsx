// app/(main)/story/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { getChapterBySlug, getAllChapters } from '@/lib/story/chapters';
import { StoryChapter } from '@/components/story/StoryChapter';
import fs from 'fs';
import path from 'path';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getChapterContent(slug: string): Promise<string> {
  const chapters = getAllChapters();
  const chapter = chapters.find(c => c.slug === slug);

  if (!chapter) return '';

  const filePath = path.join(
    process.cwd(),
    'content',
    'story',
    'chapters',
    `${chapter.id}-${slug.replace(/-/g, '-')}.md`
  );

  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    const altPath = path.join(
      process.cwd(),
      'content',
      'story',
      'chapters',
      `${chapter.id}-${slug}.md`
    );
    try {
      return fs.readFileSync(altPath, 'utf-8');
    } catch {
      return '';
    }
  }
}

export async function generateStaticParams() {
  const chapters = getAllChapters();
  return chapters.map(chapter => ({
    slug: chapter.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    return { title: 'Chapter Not Found' };
  }

  return {
    title: `${chapter.title} | The Story | Scripture Explorer`,
    description: `Chapter ${chapter.order}: ${chapter.title} - Journey through biblical history`,
  };
}

export default async function StoryChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);

  if (!chapter) {
    notFound();
  }

  const content = await getChapterContent(slug);

  return <StoryChapter chapter={chapter} content={content} />;
}
