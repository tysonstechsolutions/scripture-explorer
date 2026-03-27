// app/(main)/admin/paths/[slug]/edit/page.tsx

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PathEditor } from '@/components/paths/PathEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/contexts/AdminContext';
import type { LearningPath } from '@/lib/paths/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EditPathPage({ params }: PageProps) {
  const { slug } = use(params);
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
      return;
    }

    async function loadPath() {
      try {
        const res = await fetch(`/api/paths/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPath(data.path);
        } else {
          router.push('/admin/paths');
        }
      } catch (error) {
        console.error('Failed to load path:', error);
        router.push('/admin/paths');
      } finally {
        setLoading(false);
      }
    }

    loadPath();
  }, [slug, isAdmin, router]);

  const handleSave = async (data: Partial<LearningPath>) => {
    const res = await fetch(`/api/paths/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/admin/paths');
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to update path');
    }
  };

  const handleCancel = () => {
    router.push('/admin/paths');
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="pb-20">
        <Header title="Edit Path" showBack />
        <div className="p-4 space-y-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  if (!path) {
    return null;
  }

  return (
    <div className="pb-20">
      <Header title="Edit Path" showBack />
      <div className="p-4">
        <PathEditor path={path} onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
}
