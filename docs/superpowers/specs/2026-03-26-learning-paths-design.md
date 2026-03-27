# Learning Paths Design Specification

**Date:** 2026-03-26
**Status:** Approved
**Depends on:** Phase 1 & 2 Complete (Topic Infrastructure + Integration)

## Overview

Learning Paths are curated sequences of topics that guide users through structured learning journeys. Admins create paths by selecting and ordering existing topics. Users can browse paths, start a path, and track their progress through it.

## Data Model

### LearningPath Interface

```typescript
// lib/paths/types.ts

export type PathDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;          // Brief description for cards
  longDescription?: string;     // Optional detailed intro (markdown)
  pillar?: Pillar;              // Optional primary pillar association
  difficulty: PathDifficulty;
  estimatedMinutes: number;     // Total estimated reading time
  topics: string[];             // Ordered array of topic slugs
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface PathIndexEntry {
  slug: string;
  title: string;
  description: string;
  pillar?: Pillar;
  difficulty: PathDifficulty;
  estimatedMinutes: number;
  topicCount: number;
  status: 'draft' | 'published';
  updatedAt: string;
}

export interface PathIndex {
  paths: PathIndexEntry[];
  lastUpdated: string;
}
```

### Storage Structure

```
content/paths/
  index.json              # Path index for fast listing
  understanding-prophecy.json
  bible-reliability.json
  church-history-basics.json
  ...
```

### User Progress

Extend existing `TopicProgressContext` to track path engagement:

```typescript
interface PathProgress {
  activePaths: {
    pathSlug: string;
    startedAt: string;
  }[];
  completedPaths: {
    pathSlug: string;
    completedAt: string;
  }[];
}
```

Path completion is derived: if all topics in a path are marked as read, the path is complete.

## API Routes

### GET /api/paths
List all paths with optional filters.

Query params:
- `status`: 'draft' | 'published' (default: published for non-admin)
- `pillar`: filter by pillar
- `difficulty`: filter by difficulty

Response:
```json
{
  "paths": [PathIndexEntry, ...]
}
```

### POST /api/paths
Create a new path (admin only).

Body: `Omit<LearningPath, 'id' | 'createdAt' | 'updatedAt'>`

### GET /api/paths/[slug]
Get a single path with full details.

Response:
```json
{
  "path": LearningPath,
  "topics": TopicIndexEntry[]  // Resolved topic data for each slug
}
```

### PUT /api/paths/[slug]
Update a path (admin only).

### DELETE /api/paths/[slug]
Delete a path (admin only).

## Pages

### /paths - Path Browser

Lists all published paths with filtering options.

Features:
- Filter by pillar (optional)
- Filter by difficulty
- Show path cards with: title, description, difficulty badge, topic count, estimated time
- Highlight paths user has started or completed

### /paths/[slug] - Path Detail

Shows path overview and topic sequence with progress.

Features:
- Path title, description, difficulty, estimated time
- Progress bar (X of Y topics completed)
- Ordered topic list with:
  - Topic number (1, 2, 3...)
  - Topic title and hook
  - Read/unread status indicator
  - Link to topic
- "Start Path" button (if not started)
- "Continue" button jumping to first unread topic
- Completion celebration when all topics read

### /admin/paths - Path Management

Admin dashboard for paths.

Features:
- List all paths (including drafts)
- Status badges (draft/published)
- Edit/Delete actions
- "New Path" button

### /admin/paths/new - Create Path

Form for creating a new path.

Fields:
- Title (required)
- Slug (auto-generated, editable)
- Description (required, short)
- Long Description (optional, markdown)
- Pillar (optional dropdown)
- Difficulty (required, select)
- Estimated Minutes (required, number)
- Status (draft/published)
- Topics (ordered list builder)

Topic selector:
- Search/filter published topics
- Drag-and-drop reordering
- Show topic titles with pillar badges

### /admin/paths/[slug]/edit - Edit Path

Same form as create, pre-populated with existing data.

## Components

### PathCard
Preview card for path listings.

Props:
```typescript
interface PathCardProps {
  path: PathIndexEntry;
  progress?: {
    completedTopics: number;
    totalTopics: number;
    isStarted: boolean;
    isCompleted: boolean;
  };
}
```

Displays:
- Title
- Description (truncated)
- Difficulty badge with color
- Pillar badge (if set)
- Topic count + estimated time
- Progress bar (if started)
- Completion checkmark (if completed)

### PathProgress
Detailed progress display for path detail page.

Props:
```typescript
interface PathProgressProps {
  path: LearningPath;
  topics: TopicIndexEntry[];
  readTopics: string[];
}
```

Displays:
- Overall progress bar with percentage
- Topic checklist with read/unread states
- "Continue Reading" button to next unread topic

### PathTopicList
Ordered list of topics within a path.

Props:
```typescript
interface PathTopicListProps {
  topics: TopicIndexEntry[];
  readTopics: string[];
  pathSlug: string;
}
```

Displays:
- Numbered list (1, 2, 3...)
- Topic cards with read status
- Visual connection lines between topics

### PathEditor
Admin form for creating/editing paths.

Props:
```typescript
interface PathEditorProps {
  path?: LearningPath;  // undefined for create mode
  onSave: (path: LearningPath) => void;
  onCancel: () => void;
}
```

Features:
- Form fields for all path properties
- Topic search and selection
- Drag-and-drop topic reordering
- Preview of topic sequence

### PathTopicSelector
Topic selection interface for PathEditor.

Props:
```typescript
interface PathTopicSelectorProps {
  selectedTopics: string[];
  onChange: (topics: string[]) => void;
}
```

Features:
- Search input
- Pillar filter
- Available topics list
- Selected topics with drag handles
- Add/remove controls

## Context Updates

### TopicProgressContext Extensions

Add to existing context:

```typescript
interface TopicProgressContextType {
  // ... existing methods

  // Path tracking
  startPath: (pathSlug: string) => void;
  isPathStarted: (pathSlug: string) => boolean;
  isPathCompleted: (pathSlug: string, topicSlugs: string[]) => boolean;
  getPathProgress: (pathSlug: string, topicSlugs: string[]) => {
    completed: number;
    total: number;
    percentage: number;
  };
  getActivePaths: () => { pathSlug: string; startedAt: string }[];
  getCompletedPaths: () => { pathSlug: string; completedAt: string }[];
}
```

Path completion is computed from topic read status - when all topics in a path are read, the path is automatically marked complete.

## Home Page Integration

Add "Learning Paths" section to home page after the five pillars:

```tsx
{/* Learning Paths */}
{activePaths.length > 0 && (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Route className="h-5 w-5 text-muted-foreground" />
      <h3 className="font-semibold">Your Learning Paths</h3>
    </div>
    {activePaths.map(path => (
      <PathCard key={path.slug} path={path} progress={...} />
    ))}
  </div>
)}

{/* Suggested Paths */}
{suggestedPaths.length > 0 && (
  <div className="space-y-3">
    <h3 className="font-semibold">Start a Learning Path</h3>
    {suggestedPaths.slice(0, 2).map(path => (
      <PathCard key={path.slug} path={path} />
    ))}
    <Link href="/paths">
      <Button variant="outline" size="sm">View All Paths</Button>
    </Link>
  </div>
)}
```

## Bottom Navigation

Keep existing navigation structure. The Progress page will be updated to show path progress alongside topic progress - no new nav item needed. Users access paths via:
- Home page "Learning Paths" section
- Progress page path progress section
- Direct `/paths` URL

## Difficulty Badges

Color coding for difficulty levels:

- Beginner: Green (`bg-green-100 text-green-800`)
- Intermediate: Amber (`bg-amber-100 text-amber-800`)
- Advanced: Red (`bg-red-100 text-red-800`)

## File Structure

### New Files

```
lib/paths/
  types.ts              # LearningPath, PathIndex interfaces
  storage.ts            # File-based read/write operations

content/paths/
  index.json            # Path index

app/api/paths/
  route.ts              # GET (list), POST (create)
  [slug]/route.ts       # GET, PUT, DELETE single path

app/(main)/paths/
  page.tsx              # Path browser
  [slug]/page.tsx       # Path detail

app/(main)/admin/paths/
  page.tsx              # Path management
  new/page.tsx          # Create path
  [slug]/edit/page.tsx  # Edit path

components/paths/
  PathCard.tsx          # Preview card
  PathProgress.tsx      # Progress display
  PathTopicList.tsx     # Topic sequence list
  PathEditor.tsx        # Admin form
  PathTopicSelector.tsx # Topic selection UI
```

### Modified Files

```
contexts/TopicProgressContext.tsx  # Add path tracking
app/(main)/page.tsx                # Add paths section
components/layout/BottomNav.tsx    # Optional: update navigation
```

## Verification

After implementation:

1. Admin can create a new path with selected topics
2. Admin can reorder topics in a path
3. Admin can publish/unpublish paths
4. User can browse published paths
5. User can start a path and see progress
6. Reading topics updates path progress
7. Completing all topics shows path as completed
8. Home page shows active paths
9. Path detail page shows "Continue" button to next unread topic
