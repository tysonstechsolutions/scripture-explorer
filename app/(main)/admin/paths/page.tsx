// app/(main)/admin/paths/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, Clock, BookOpen } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import type { PathIndexEntry } from '@/lib/paths/types';
import { DIFFICULTY_INFO } from '@/lib/paths/types';

export default function AdminPathsPage() {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [paths, setPaths] = useState<PathIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
      return;
    }

    async function loadPaths() {
      try {
        const res = await fetch('/api/paths');
        if (res.ok) {
          const data = await res.json();
          setPaths(data.paths);
        }
      } catch (error) {
        console.error('Failed to load paths:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPaths();
  }, [isAdmin, router]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this path?')) return;

    try {
      const res = await fetch(`/api/paths/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPaths(paths.filter(p => p.slug !== slug));
      }
    } catch (error) {
      console.error('Failed to delete path:', error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="pb-20">
      <Header
        title="Manage Paths"
        showBack
        rightAction={
          <Link href="/admin/paths/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Path
            </Button>
          </Link>
        }
      />

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : paths.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No learning paths yet.</p>
            <Link href="/admin/paths/new">
              <Button variant="link">Create your first path</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {paths.map(path => {
              const difficultyInfo = DIFFICULTY_INFO[path.difficulty];

              return (
                <Card key={path.slug}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{path.title}</h3>
                          <Badge
                            variant={path.status === 'published' ? 'default' : 'secondary'}
                          >
                            {path.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {path.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{difficultyInfo.label}</Badge>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {path.topicCount} topics
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {path.estimatedMinutes} min
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Link href={`/admin/paths/${path.slug}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(path.slug)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
