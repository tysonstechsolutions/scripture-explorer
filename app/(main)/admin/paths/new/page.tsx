// app/(main)/admin/paths/new/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PathEditor } from '@/components/paths/PathEditor';
import { useAdmin } from '@/contexts/AdminContext';
import { useEffect } from 'react';
import type { LearningPath } from '@/lib/paths/types';

export default function NewPathPage() {
  const { isAdmin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  const handleSave = async (data: Partial<LearningPath>) => {
    const res = await fetch('/api/paths', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/admin/paths');
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to create path');
    }
  };

  const handleCancel = () => {
    router.push('/admin/paths');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="pb-20">
      <Header title="Create Learning Path" showBack />
      <div className="p-4">
        <PathEditor onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
}
