// app/(main)/explore/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { findTopicBySlug } from '@/lib/topics/storage';
import { TopicArticle } from '@/components/topics/TopicArticle';
import { TopicBreadcrumb } from '@/components/topics/TopicBreadcrumb';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await findTopicBySlug(slug);

  if (!result) {
    notFound();
  }

  return (
    <div className="p-4 pb-20">
      <TopicBreadcrumb pillar={result.topic.pillar} topicTitle={result.topic.title} />
      <TopicArticle topic={result.topic} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const result = await findTopicBySlug(slug);

  if (!result) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: result.topic.title,
    description: result.topic.hook,
  };
}
