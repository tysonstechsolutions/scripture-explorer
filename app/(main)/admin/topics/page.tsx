// app/(main)/admin/topics/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import type { TopicIndexEntry } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
};

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
      return;
    }

    async function loadTopics() {
      try {
        const res = await fetch('/api/topics');
        if (res.ok) {
          const data = await res.json();
          setTopics(data.topics);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, [isAdmin, router]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) {
      return;
    }

    try {
      const res = await fetch(`/api/topics/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setTopics(prev => prev.filter(t => t.slug !== slug));
      }
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="pb-20">
      <Header
        title="Manage Topics"
        showBack
        rightAction={
          <Link href="/admin/topics/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </Link>
        }
      />

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No topics yet.</p>
            <Link href="/admin/topics/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create your first topic
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {topics.map(topic => (
              <Card key={topic.slug}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{topic.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {PILLAR_INFO[topic.pillar].name}
                      </Badge>
                      <Badge className={`text-xs ${statusColors[topic.status]}`}>
                        {topic.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/admin/topics/${topic.slug}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(topic.slug)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
