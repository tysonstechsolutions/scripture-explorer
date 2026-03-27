# Phase 2: Learning Platform Integration

**Date:** 2026-03-26
**Status:** Ready for Implementation
**Depends on:** Phase 1 (Complete)

## Overview

Phase 2 connects the learning content system (topics) with existing Scripture Explorer features: Bible reader, timeline, search, and user data (notes/bookmarks). This creates a cohesive learning experience where users can seamlessly move between reading Scripture, exploring historical context, and tracking their learning.

## Integration Points from Codebase Exploration

### Bible Reader Structure
- `app/(main)/read/[book]/[chapter]/page.tsx` - SSR page fetching chapter data
- `components/bible/ChapterReader.tsx` - Client-side state management
- `components/bible/ChapterContent.tsx` - Verse rendering with verse actions
- Topics link via `scriptureRefs: ScriptureRef[]` (bookId, chapter, verse, verseEnd)

### Timeline Structure
- `lib/timeline/eras.ts` - 14 biblical eras with id, name, description, dateRange, keyFigures
- `app/(main)/timeline/page.tsx` - Era listing
- `app/(main)/timeline/[eraId]/page.tsx` - Era detail page
- Topics link via `timelineEra?: string` matching era.id

### Search Structure
- `app/api/search/route.ts` - Calls API.Bible search endpoint
- Returns `{ verses: [{ reference, text, bookId, chapter, verse }] }`
- Needs extension to also search topic index

### User Data Structure
- `contexts/UserDataContext.tsx` - Manages bookmarks, notes, highlights, memory verses
- `Bookmark`: `{ id, bookId, chapter, verse, createdAt }`
- `Note`: `{ id, bookId, chapter, verse, content, createdAt, updatedAt }`
- `Highlight`: `{ id, bookId, chapter, verse, color, createdAt }`
- Needs extension for topic bookmarks and notes

---

## Tasks

### 1. Extend Types for Topic User Data

**File:** `lib/topics/types.ts`

Add types for topic bookmarks and notes:

```typescript
export interface TopicBookmark {
  id: string;
  topicSlug: string;
  createdAt: string;
}

export interface TopicNote {
  id: string;
  topicSlug: string;
  sectionIndex?: number; // Optional: specific deep dive section
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Extend UserDataContext for Topics

**File:** `contexts/UserDataContext.tsx`

Add to existing context:
- `topicBookmarks: TopicBookmark[]`
- `topicNotes: TopicNote[]`
- `isTopicBookmarked(slug: string): boolean`
- `addTopicBookmark(slug: string): void`
- `removeTopicBookmark(slug: string): void`
- `getTopicNotes(slug: string): TopicNote[]`
- `addTopicNote(slug: string, content: string, sectionIndex?: number): void`
- `updateTopicNote(id: string, content: string): void`
- `deleteTopicNote(id: string): void`

### 3. Create Topic Callout Component

**File:** `components/bible/TopicCallout.tsx`

Small inline callout that appears in chapter content when a topic references this passage:

```typescript
interface TopicCalloutProps {
  topic: TopicIndexEntry;
  onPress: () => void;
}
```

Displays topic title with pill-style badge, links to topic article.

### 4. Create useTopicsForPassage Hook

**File:** `lib/hooks/useTopicsForPassage.ts`

Hook that finds topics referencing a specific passage:

```typescript
function useTopicsForPassage(bookId: string, chapter: number): TopicIndexEntry[]
```

Fetches topic index, filters by scriptureRefs matching book/chapter.

### 5. Integrate Topic Callouts in ChapterContent

**File:** `components/bible/ChapterContent.tsx`

After verses render, show topic callouts:
- Use `useTopicsForPassage` hook
- Display callouts below verse range that matches
- Handle navigation to topic article

### 6. Create TopicsByEra API Route

**File:** `app/api/topics/by-era/[eraId]/route.ts`

Returns topics where `timelineEra === eraId`:

```typescript
GET /api/topics/by-era/creation
// Returns { topics: TopicIndexEntry[] }
```

### 7. Integrate Topics in Era Detail Page

**File:** `app/(main)/timeline/[eraId]/page.tsx`

Add "Related Topics" section:
- Fetch topics via `/api/topics/by-era/[eraId]`
- Display as TopicCard list
- Show empty state if no topics for era

### 8. Create Unified Search API

**File:** `app/api/search/route.ts`

Extend existing search to include topics:
- Add `type` query param: `all`, `scripture`, `topics`
- Search topic titles, hooks, and overview text
- Return combined results with type indicators

```typescript
interface SearchResult {
  type: 'verse' | 'topic';
  // verse fields or topic fields
}
```

### 9. Update Search Page for Unified Results

**File:** `app/(main)/search/page.tsx`

Extend to show both Scripture and topic results:
- Add filter tabs: All, Scripture, Topics
- Display topic results with TopicCard
- Display verse results with existing verse cards
- Show result counts per type

### 10. Create TopicBookmarkButton Component

**File:** `components/topics/TopicBookmarkButton.tsx`

Bookmark toggle button for topic articles:

```typescript
interface TopicBookmarkButtonProps {
  topicSlug: string;
}
```

Uses UserDataContext to toggle bookmark state.

### 11. Create TopicNoteEditor Component

**File:** `components/topics/TopicNoteEditor.tsx`

Note input for topic articles:

```typescript
interface TopicNoteEditorProps {
  topicSlug: string;
  sectionIndex?: number;
  existingNote?: TopicNote;
  onSave: () => void;
  onCancel: () => void;
}
```

Text input with save/cancel, uses UserDataContext.

### 12. Create TopicNotesList Component

**File:** `components/topics/TopicNotesList.tsx`

Display user's notes for a topic:

```typescript
interface TopicNotesListProps {
  topicSlug: string;
  onEdit: (note: TopicNote) => void;
}
```

Lists notes with edit/delete options.

### 13. Integrate Bookmarks/Notes in TopicArticle

**File:** `components/topics/TopicArticle.tsx`

Add to article view:
- Bookmark button in header area
- "My Notes" section at bottom
- Add note button on each deep dive section
- Note editor modal/sheet

### 14. Create Bookmarks Page Topics Tab

**File:** `app/(main)/bookmarks/page.tsx`

Add tabs for Scripture vs Topic bookmarks:
- Tab navigation: Scripture | Topics
- Topic bookmarks show TopicCard list
- Link to topic articles

### 15. Create Notes Page Topics Section

**File:** `app/(main)/notes/page.tsx`

Add section for topic notes:
- Group by topic
- Show note content with topic title
- Link to topic article at section

### 16. Add "Related Topics" to Topic Article

**File:** `components/topics/TopicArticle.tsx`

Show related topics section:
- Use `topic.relatedTopics` slugs
- Fetch topic data for each
- Display as horizontal scroll of TopicCards

### 17. Add Scripture Context to ScripturePanel

**File:** `components/scripture/ScripturePanel.tsx`

Enhance panel with related topics:
- When showing verse, find topics referencing it
- Add "Related Topics" section below verse text
- Display as small topic links

### 18. Create TopicBreadcrumb Component

**File:** `components/topics/TopicBreadcrumb.tsx`

Navigation breadcrumb for topic pages:

```typescript
interface TopicBreadcrumbProps {
  pillar: Pillar;
  topicTitle?: string;
}
```

Shows: Explore > [Pillar Name] > [Topic Title]

### 19. Add Breadcrumbs to Topic Pages

**Files:**
- `app/(main)/explore/[slug]/page.tsx`
- `app/(main)/admin/topics/[slug]/edit/page.tsx`

Add TopicBreadcrumb for navigation context.

### 20. Create Reading History

**File:** `contexts/TopicProgressContext.tsx`

Extend to track reading history:
- `readHistory: { slug: string; readAt: string }[]`
- `getRecentlyRead(limit: number): TopicIndexEntry[]`

### 21. Add "Continue Reading" to Home Page

**File:** `app/(main)/page.tsx`

Add section showing recently read topics:
- Use reading history from context
- Show last 3 topics as cards
- "Continue" CTA to resume reading

### 22. Add "Suggested Topics" to Progress Page

**File:** `app/(main)/progress/page.tsx`

Add recommendations section:
- Based on read topics, suggest related ones
- Use relatedTopics from completed topics
- Filter out already-read topics

---

## Implementation Order

**Group A: User Data Foundation (Tasks 1-2)**
- Extend types and context for topic bookmarks/notes

**Group B: Bible Reader Integration (Tasks 3-5)**
- Topic callouts in chapter content

**Group C: Timeline Integration (Tasks 6-7)**
- Topics in era detail pages

**Group D: Unified Search (Tasks 8-9)**
- Combined Scripture and topic search

**Group E: Notes & Bookmarks UI (Tasks 10-15)**
- Bookmark/note components and pages

**Group F: Navigation & Discovery (Tasks 16-22)**
- Related topics, breadcrumbs, reading history

---

## Verification

After implementation:
1. Read a Bible chapter → See topic callouts linking to relevant topics
2. View timeline era → See topics for that era
3. Search "David" → Get both verses and topics mentioning David
4. Bookmark a topic → See it in bookmarks page
5. Add note to topic → See it in notes page
6. View topic article → See related topics section
7. Check progress page → See suggested topics based on reading history
