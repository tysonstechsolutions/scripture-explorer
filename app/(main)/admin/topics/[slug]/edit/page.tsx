// app/(main)/admin/topics/[slug]/edit/page.tsx

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { TopicEditor } from '@/components/topics/TopicEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/contexts/AdminContext';
import type { Topic } from '@/lib/topics/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EditTopicPage({ params }: PageProps) {
  const { slug } = use(params);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
      return;
    }

    async function loadTopic() {
      try {
        const res = await fetch(`/api/topics/${slug}`);
        if (!res.ok) {
          throw new Error('Topic not found');
        }
        const data = await res.json();
        setTopic(data.topic);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    }

    loadTopic();
  }, [slug, isAdmin, router]);

  const handleSave = async (topicData: Omit<Topic, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch(`/api/topics/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update topic');
    }

    // Reload topic to get updated data
    const updated = await res.json();
    setTopic(updated.topic);
  };

  const handlePreview = () => {
    window.open(`/explore/${slug}`, '_blank');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="pb-20">
      <Header title="Edit Topic" showBack />

      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-20" />
            <Skeleton className="h-60" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            {error}
          </div>
        ) : topic ? (
          <TopicEditor
            initialTopic={topic}
            onSave={handleSave}
            onPreview={handlePreview}
          />
        ) : null}
      </div>
    </div>
  );
}
