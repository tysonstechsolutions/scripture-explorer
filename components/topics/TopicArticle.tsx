// components/topics/TopicArticle.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, CheckCircle2, PenLine, Plus, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { DeepDiveSection } from './DeepDiveSection';
import { TopicBookmarkButton } from './TopicBookmarkButton';
import { TopicNoteEditor } from './TopicNoteEditor';
import { TopicNotesList } from './TopicNotesList';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import { useAdmin } from '@/contexts/AdminContext';
import type { Topic, Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface TopicArticleProps {
  topic: Topic;
}

const pillarColorMap: Record<Pillar, string> = {
  text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  prophecy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  church: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  judaism: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  branches: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function TopicArticle({ topic }: TopicArticleProps) {
  const { isRead, markAsRead } = useTopicProgress();
  const { isAdmin } = useAdmin();
  const pillarInfo = PILLAR_INFO[topic.pillar];
  const read = isRead(topic.slug);
  const [showNoteEditor, setShowNoteEditor] = useState(false);

  const handleShare = async () => {
    const shareText = `I'm learning about "${topic.title}" on Scripture Explorer:\n\n"${topic.hook}"\n\nExplore biblical scholarship with intellectual honesty at`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: topic.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error - try clipboard fallback
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast.success('Copied to clipboard');
        } catch {
          toast.error('Unable to share');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Unable to copy link');
      }
    }
  };

  // Mark as read after viewing for 5 seconds
  useEffect(() => {
    if (read) return;

    const timer = setTimeout(() => {
      markAsRead(topic.slug);
    }, 5000);

    return () => clearTimeout(timer);
  }, [topic.slug, read, markAsRead]);

  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={pillarColorMap[topic.pillar]}>
                {pillarInfo.name}
              </Badge>
              {read && (
                <span className="flex items-center text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Read
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share topic">
              <Share2 className="h-5 w-5" />
            </Button>
            <TopicBookmarkButton topicSlug={topic.slug} />
            {isAdmin && (
              <Link href={`/admin/topics/${topic.slug}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hook */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6 border-l-4 border-primary">
        <p className="text-lg italic">{topic.hook}</p>
      </div>

      {/* Overview */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: topic.overview }}
      />

      {/* Deep Dive Sections */}
      {topic.deepDive.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Deep Dive</h2>
          <div className="space-y-3">
            {topic.deepDive.map(section => (
              <DeepDiveSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      )}

      {/* Related Topics */}
      {topic.relatedTopics.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-lg font-semibold mb-3">Related Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topic.relatedTopics.map(slug => (
              <Link key={slug} href={`/explore/${slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  {slug.replace(/-/g, ' ')}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* My Notes Section */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <PenLine className="h-5 w-5" />
            My Notes
          </h2>
          {!showNoteEditor && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNoteEditor(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          )}
        </div>

        {showNoteEditor && (
          <div className="mb-4">
            <TopicNoteEditor
              topicSlug={topic.slug}
              onSave={() => setShowNoteEditor(false)}
              onCancel={() => setShowNoteEditor(false)}
            />
          </div>
        )}

        <TopicNotesList topicSlug={topic.slug} />
      </div>
    </article>
  );
}
