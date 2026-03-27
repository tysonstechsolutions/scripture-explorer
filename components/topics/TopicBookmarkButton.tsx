// components/topics/TopicBookmarkButton.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';

interface TopicBookmarkButtonProps {
  topicSlug: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function TopicBookmarkButton({
  topicSlug,
  variant = 'outline',
  size = 'icon',
}: TopicBookmarkButtonProps) {
  const { isTopicBookmarked, addTopicBookmark, removeTopicBookmark } = useUserData();
  const bookmarked = isTopicBookmarked(topicSlug);

  const handleToggle = () => {
    if (bookmarked) {
      removeTopicBookmark(topicSlug);
    } else {
      addTopicBookmark(topicSlug);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4 text-primary" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  );
}
