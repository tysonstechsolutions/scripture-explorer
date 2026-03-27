# Learning Paths Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build curated learning paths that guide users through ordered sequences of topics with progress tracking.

**Architecture:** File-based JSON storage for paths (mirrors topic system), API routes for CRUD, context extension for path progress tracking, admin UI for path management, and reader UI for path browsing/progress.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, localStorage for progress.

---

## File Structure

### New Files

```
lib/paths/
  types.ts              # LearningPath, PathIndex, PathIndexEntry interfaces
  storage.ts            # File-based read/write operations

content/paths/
  index.json            # Path index for fast listing

app/api/paths/
  route.ts              # GET (list), POST (create)
  [slug]/route.ts       # GET, PUT, DELETE single path

app/(main)/paths/
  page.tsx              # Path browser
  [slug]/page.tsx       # Path detail with progress

app/(main)/admin/paths/
  page.tsx              # Path management list
  new/page.tsx          # Create path form
  [slug]/edit/page.tsx  # Edit path form

components/paths/
  PathCard.tsx          # Preview card for listings
  PathProgress.tsx      # Progress bar and stats
  PathTopicList.tsx     # Ordered topic list with status
  PathEditor.tsx        # Admin create/edit form
  PathTopicSelector.tsx # Topic search and drag-drop ordering
```

### Modified Files

```
contexts/TopicProgressContext.tsx  # Add path tracking methods
app/(main)/page.tsx                # Add paths section to home
app/(main)/progress/page.tsx       # Add path progress section
```

---

## Task 1: Path Type Definitions

**Files:**
- Create: `lib/paths/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// lib/paths/types.ts

import type { Pillar } from '@/lib/topics/types';

export type PathDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  pillar?: Pillar;
  difficulty: PathDifficulty;
  estimatedMinutes: number;
  topics: string[];
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

export const DIFFICULTY_INFO: Record<PathDifficulty, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'green' },
  intermediate: { label: 'Intermediate', color: 'amber' },
  advanced: { label: 'Advanced', color: 'red' },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npx tsc --noEmit lib/paths/types.ts`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/paths/types.ts
git commit -m "feat(paths): add learning path type definitions"
```

---

## Task 2: Path Storage Layer

**Files:**
- Create: `lib/paths/storage.ts`
- Create: `content/paths/index.json`

- [ ] **Step 1: Create empty path index**

```json
{
  "paths": [],
  "lastUpdated": "2026-03-26T00:00:00.000Z"
}
```

- [ ] **Step 2: Create storage module**

```typescript
// lib/paths/storage.ts

import { promises as fs } from 'fs';
import path from 'path';
import type { LearningPath, PathIndex, PathIndexEntry } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'paths');
const INDEX_PATH = path.join(CONTENT_DIR, 'index.json');

function getPathFilePath(slug: string): string {
  return path.join(CONTENT_DIR, `${slug}.json`);
}

export async function readPathIndex(): Promise<PathIndex> {
  try {
    const data = await fs.readFile(INDEX_PATH, 'utf-8');
    return JSON.parse(data) as PathIndex;
  } catch {
    return { paths: [], lastUpdated: new Date().toISOString() };
  }
}

export async function writePathIndex(index: PathIndex): Promise<void> {
  index.lastUpdated = new Date().toISOString();
  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2), 'utf-8');
}

export async function readPath(slug: string): Promise<LearningPath | null> {
  try {
    const filePath = getPathFilePath(slug);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as LearningPath;
  } catch {
    return null;
  }
}

export async function writePath(learningPath: LearningPath): Promise<void> {
  const filePath = getPathFilePath(learningPath.slug);
  await fs.writeFile(filePath, JSON.stringify(learningPath, null, 2), 'utf-8');

  const index = await readPathIndex();
  const entry: PathIndexEntry = {
    slug: learningPath.slug,
    title: learningPath.title,
    description: learningPath.description,
    pillar: learningPath.pillar,
    difficulty: learningPath.difficulty,
    estimatedMinutes: learningPath.estimatedMinutes,
    topicCount: learningPath.topics.length,
    status: learningPath.status,
    updatedAt: learningPath.updatedAt,
  };

  const existingIdx = index.paths.findIndex(p => p.slug === learningPath.slug);
  if (existingIdx >= 0) {
    index.paths[existingIdx] = entry;
  } else {
    index.paths.push(entry);
  }

  await writePathIndex(index);
}

export async function deletePath(slug: string): Promise<boolean> {
  try {
    const filePath = getPathFilePath(slug);
    await fs.unlink(filePath);

    const index = await readPathIndex();
    index.paths = index.paths.filter(p => p.slug !== slug);
    await writePathIndex(index);

    return true;
  } catch {
    return false;
  }
}

export async function listPaths(options?: {
  status?: 'draft' | 'published';
  pillar?: string;
  difficulty?: string;
}): Promise<PathIndexEntry[]> {
  const index = await readPathIndex();
  let paths = index.paths;

  if (options?.status) {
    paths = paths.filter(p => p.status === options.status);
  }
  if (options?.pillar) {
    paths = paths.filter(p => p.pillar === options.pillar);
  }
  if (options?.difficulty) {
    paths = paths.filter(p => p.difficulty === options.difficulty);
  }

  return paths;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npx tsc --noEmit lib/paths/storage.ts`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/paths/storage.ts content/paths/index.json
git commit -m "feat(paths): add path storage layer"
```

---

## Task 3: Paths List API Route

**Files:**
- Create: `app/api/paths/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
// app/api/paths/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { readPathIndex, writePath } from '@/lib/paths/storage';
import type { LearningPath } from '@/lib/paths/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const pillar = searchParams.get('pillar');
  const difficulty = searchParams.get('difficulty');

  try {
    const index = await readPathIndex();
    let paths = index.paths;

    if (status) {
      paths = paths.filter(p => p.status === status);
    }
    if (pillar) {
      paths = paths.filter(p => p.pillar === pillar);
    }
    if (difficulty) {
      paths = paths.filter(p => p.difficulty === difficulty);
    }

    return NextResponse.json({ paths });
  } catch (error) {
    console.error('Error fetching paths:', error);
    return NextResponse.json({ error: 'Failed to fetch paths' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const newPath: LearningPath = {
      id,
      slug: body.slug,
      title: body.title,
      description: body.description,
      longDescription: body.longDescription,
      pillar: body.pillar,
      difficulty: body.difficulty,
      estimatedMinutes: body.estimatedMinutes,
      topics: body.topics || [],
      status: body.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    await writePath(newPath);

    return NextResponse.json({ path: newPath }, { status: 201 });
  } catch (error) {
    console.error('Error creating path:', error);
    return NextResponse.json({ error: 'Failed to create path' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds or shows unrelated errors only

- [ ] **Step 3: Commit**

```bash
git add app/api/paths/route.ts
git commit -m "feat(paths): add paths list and create API"
```

---

## Task 4: Single Path API Route

**Files:**
- Create: `app/api/paths/[slug]/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
// app/api/paths/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { readPath, writePath, deletePath } from '@/lib/paths/storage';
import { listTopics } from '@/lib/topics/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const path = await readPath(slug);

    if (!path) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    // Fetch topic data for each slug in the path
    const allTopics = await listTopics({ status: 'published' });
    const topics = path.topics
      .map(topicSlug => allTopics.find(t => t.slug === topicSlug))
      .filter(Boolean);

    return NextResponse.json({ path, topics });
  } catch (error) {
    console.error('Error fetching path:', error);
    return NextResponse.json({ error: 'Failed to fetch path' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const existing = await readPath(slug);

    if (!existing) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    const body = await request.json();
    const now = new Date().toISOString();

    const updatedPath = {
      ...existing,
      ...body,
      id: existing.id,
      slug: existing.slug,
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    await writePath(updatedPath);

    return NextResponse.json({ path: updatedPath });
  } catch (error) {
    console.error('Error updating path:', error);
    return NextResponse.json({ error: 'Failed to update path' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const success = await deletePath(slug);

    if (!success) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting path:', error);
    return NextResponse.json({ error: 'Failed to delete path' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/api/paths/[slug]/route.ts
git commit -m "feat(paths): add single path CRUD API"
```

---

## Task 5: PathCard Component

**Files:**
- Create: `components/paths/PathCard.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/paths/PathCard.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import type { PathIndexEntry } from '@/lib/paths/types';
import { DIFFICULTY_INFO } from '@/lib/paths/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PathCardProps {
  path: PathIndexEntry;
  progress?: {
    completedTopics: number;
    totalTopics: number;
    isStarted: boolean;
    isCompleted: boolean;
  };
}

const difficultyColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function PathCard({ path, progress }: PathCardProps) {
  const difficultyInfo = DIFFICULTY_INFO[path.difficulty];
  const pillarInfo = path.pillar ? PILLAR_INFO[path.pillar] : null;
  const percentage = progress
    ? Math.round((progress.completedTopics / progress.totalTopics) * 100)
    : 0;

  return (
    <Link href={`/paths/${path.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2">{path.title}</h3>
            {progress?.isCompleted && (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {path.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge className={difficultyColors[difficultyInfo.color]}>
              {difficultyInfo.label}
            </Badge>
            {pillarInfo && (
              <Badge variant="outline">{pillarInfo.name}</Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {path.topicCount} topics
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {path.estimatedMinutes} min
            </span>
          </div>

          {progress?.isStarted && !progress.isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add components/paths/PathCard.tsx
git commit -m "feat(paths): add PathCard component"
```

---

## Task 6: PathTopicList Component

**Files:**
- Create: `components/paths/PathTopicList.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/paths/PathTopicList.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import type { TopicIndexEntry } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PathTopicListProps {
  topics: TopicIndexEntry[];
  readTopics: string[];
  pathSlug: string;
}

export function PathTopicList({ topics, readTopics, pathSlug }: PathTopicListProps) {
  return (
    <div className="space-y-3">
      {topics.map((topic, index) => {
        const isRead = readTopics.includes(topic.slug);
        const pillarInfo = PILLAR_INFO[topic.pillar];

        return (
          <Link
            key={topic.slug}
            href={`/explore/${topic.slug}?from=path&path=${pathSlug}`}
          >
            <Card
              className={`hover:shadow-sm transition-shadow cursor-pointer ${
                isRead ? 'border-green-200 dark:border-green-800' : ''
              }`}
            >
              <CardContent className="flex items-center gap-4 py-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{topic.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {topic.hook}
                  </p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {pillarInfo.name}
                  </Badge>
                </div>

                {isRead ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add components/paths/PathTopicList.tsx
git commit -m "feat(paths): add PathTopicList component"
```

---

## Task 7: PathProgress Component

**Files:**
- Create: `components/paths/PathProgress.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/paths/PathProgress.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, PlayCircle } from 'lucide-react';
import type { TopicIndexEntry } from '@/lib/topics/types';

interface PathProgressProps {
  pathSlug: string;
  topics: TopicIndexEntry[];
  readTopics: string[];
  onStart?: () => void;
}

export function PathProgress({
  pathSlug,
  topics,
  readTopics,
  onStart,
}: PathProgressProps) {
  const completedCount = topics.filter(t => readTopics.includes(t.slug)).length;
  const totalCount = topics.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted = completedCount === totalCount && totalCount > 0;
  const isStarted = completedCount > 0;

  // Find next unread topic
  const nextTopic = topics.find(t => !readTopics.includes(t.slug));

  return (
    <Card>
      <CardContent className="py-6 space-y-4">
        {isCompleted ? (
          <div className="text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-semibold text-green-600">Path Completed!</p>
            <p className="text-sm text-muted-foreground">
              You've read all {totalCount} topics
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{percentage}%</div>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} topics completed
              </p>
            </div>

            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {nextTopic && (
              <Link href={`/explore/${nextTopic.slug}?from=path&path=${pathSlug}`}>
                <Button className="w-full" size="lg">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  {isStarted ? 'Continue Reading' : 'Start Path'}
                </Button>
              </Link>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add components/paths/PathProgress.tsx
git commit -m "feat(paths): add PathProgress component"
```

---

## Task 8: Extend TopicProgressContext

**Files:**
- Modify: `contexts/TopicProgressContext.tsx`

- [ ] **Step 1: Add path tracking to interface and state**

Add to the `TopicProgress` interface:

```typescript
interface TopicProgress {
  readTopics: string[];
  readHistory: ReadHistoryEntry[];
  activePaths: { pathSlug: string; startedAt: string }[];
  completedPaths: { pathSlug: string; completedAt: string }[];
}
```

Update `DEFAULT_PROGRESS`:

```typescript
const DEFAULT_PROGRESS: TopicProgress = {
  readTopics: [],
  readHistory: [],
  activePaths: [],
  completedPaths: [],
};
```

- [ ] **Step 2: Add path methods to context type**

Add to `TopicProgressContextType`:

```typescript
interface TopicProgressContextType {
  progress: TopicProgress;
  isRead: (slug: string) => boolean;
  markAsRead: (slug: string) => void;
  markAsUnread: (slug: string) => void;
  getRecentlyRead: (limit?: number) => ReadHistoryEntry[];
  // Path methods
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
  markPathCompleted: (pathSlug: string) => void;
}
```

- [ ] **Step 3: Implement path methods in provider**

Add these methods inside `TopicProgressProvider`:

```typescript
const startPath = useCallback((pathSlug: string) => {
  setProgress(prev => {
    if (prev.activePaths.some(p => p.pathSlug === pathSlug)) {
      return prev;
    }
    return {
      ...prev,
      activePaths: [
        ...prev.activePaths,
        { pathSlug, startedAt: new Date().toISOString() },
      ],
    };
  });
}, []);

const isPathStarted = useCallback(
  (pathSlug: string) => progress.activePaths.some(p => p.pathSlug === pathSlug),
  [progress.activePaths]
);

const isPathCompleted = useCallback(
  (pathSlug: string, topicSlugs: string[]) => {
    if (topicSlugs.length === 0) return false;
    return topicSlugs.every(slug => progress.readTopics.includes(slug));
  },
  [progress.readTopics]
);

const getPathProgress = useCallback(
  (pathSlug: string, topicSlugs: string[]) => {
    const completed = topicSlugs.filter(slug =>
      progress.readTopics.includes(slug)
    ).length;
    const total = topicSlugs.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  },
  [progress.readTopics]
);

const getActivePaths = useCallback(
  () => progress.activePaths,
  [progress.activePaths]
);

const getCompletedPaths = useCallback(
  () => progress.completedPaths,
  [progress.completedPaths]
);

const markPathCompleted = useCallback((pathSlug: string) => {
  setProgress(prev => {
    if (prev.completedPaths.some(p => p.pathSlug === pathSlug)) {
      return prev;
    }
    return {
      ...prev,
      activePaths: prev.activePaths.filter(p => p.pathSlug !== pathSlug),
      completedPaths: [
        ...prev.completedPaths,
        { pathSlug, completedAt: new Date().toISOString() },
      ],
    };
  });
}, []);
```

- [ ] **Step 4: Update provider value**

Update the provider value to include new methods:

```typescript
<TopicProgressContext.Provider
  value={{
    progress,
    isRead,
    markAsRead,
    markAsUnread,
    getRecentlyRead,
    startPath,
    isPathStarted,
    isPathCompleted,
    getPathProgress,
    getActivePaths,
    getCompletedPaths,
    markPathCompleted,
  }}
>
```

- [ ] **Step 5: Update migration in useEffect**

Update the localStorage load to handle missing path fields:

```typescript
setProgress({
  readTopics: parsed.readTopics || [],
  readHistory: parsed.readHistory || [],
  activePaths: parsed.activePaths || [],
  completedPaths: parsed.completedPaths || [],
});
```

- [ ] **Step 6: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add contexts/TopicProgressContext.tsx
git commit -m "feat(paths): extend TopicProgressContext with path tracking"
```

---

## Task 9: Paths Browser Page

**Files:**
- Create: `app/(main)/paths/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// app/(main)/paths/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { PathCard } from '@/components/paths/PathCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import type { PathIndexEntry } from '@/lib/paths/types';
import { DIFFICULTY_INFO } from '@/lib/paths/types';
import type { PathDifficulty } from '@/lib/paths/types';

const difficulties: PathDifficulty[] = ['beginner', 'intermediate', 'advanced'];

export default function PathsPage() {
  const [paths, setPaths] = useState<PathIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<PathDifficulty | 'all'>('all');
  const { progress, getPathProgress } = useTopicProgress();

  useEffect(() => {
    async function loadPaths() {
      try {
        const params = new URLSearchParams({ status: 'published' });
        if (selectedDifficulty !== 'all') {
          params.set('difficulty', selectedDifficulty);
        }

        const res = await fetch(`/api/paths?${params}`);
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
  }, [selectedDifficulty]);

  // Fetch topic counts for progress calculation
  const [pathTopics, setPathTopics] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function loadPathTopics() {
      const topicsMap: Record<string, string[]> = {};
      for (const path of paths) {
        try {
          const res = await fetch(`/api/paths/${path.slug}`);
          if (res.ok) {
            const data = await res.json();
            topicsMap[path.slug] = data.path.topics;
          }
        } catch {
          // ignore
        }
      }
      setPathTopics(topicsMap);
    }

    if (paths.length > 0) {
      loadPathTopics();
    }
  }, [paths]);

  return (
    <div className="pb-20">
      <Header title="Learning Paths" />

      <div className="p-4">
        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty('all')}
          >
            All Levels
          </Button>
          {difficulties.map(difficulty => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {DIFFICULTY_INFO[difficulty].label}
            </Button>
          ))}
        </div>

        {/* Paths Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : paths.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No learning paths available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paths.map(path => {
              const topics = pathTopics[path.slug] || [];
              const pathProgress = getPathProgress(path.slug, topics);
              const isStarted = pathProgress.completed > 0;
              const isCompleted = pathProgress.completed === pathProgress.total && pathProgress.total > 0;

              return (
                <PathCard
                  key={path.slug}
                  path={path}
                  progress={{
                    completedTopics: pathProgress.completed,
                    totalTopics: pathProgress.total,
                    isStarted,
                    isCompleted,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/\(main\)/paths/page.tsx
git commit -m "feat(paths): add paths browser page"
```

---

## Task 10: Path Detail Page

**Files:**
- Create: `app/(main)/paths/[slug]/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// app/(main)/paths/[slug]/page.tsx

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PathProgress } from '@/components/paths/PathProgress';
import { PathTopicList } from '@/components/paths/PathTopicList';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, BookOpen } from 'lucide-react';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import type { LearningPath } from '@/lib/paths/types';
import type { TopicIndexEntry } from '@/lib/topics/types';
import { DIFFICULTY_INFO } from '@/lib/paths/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const difficultyColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function PathDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { progress, startPath } = useTopicProgress();

  useEffect(() => {
    async function loadPath() {
      try {
        const res = await fetch(`/api/paths/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPath(data.path);
          setTopics(data.topics);
        } else {
          router.push('/paths');
        }
      } catch (error) {
        console.error('Failed to load path:', error);
        router.push('/paths');
      } finally {
        setLoading(false);
      }
    }

    loadPath();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="pb-20">
        <Header title="Loading..." showBack />
        <div className="p-4 space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!path) {
    return null;
  }

  const difficultyInfo = DIFFICULTY_INFO[path.difficulty];
  const pillarInfo = path.pillar ? PILLAR_INFO[path.pillar] : null;

  const handleStart = () => {
    startPath(path.slug);
  };

  return (
    <div className="pb-20">
      <Header title={path.title} showBack />

      <div className="p-4 space-y-6">
        {/* Path Info */}
        <div className="space-y-3">
          <p className="text-muted-foreground">{path.description}</p>

          <div className="flex flex-wrap gap-2">
            <Badge className={difficultyColors[difficultyInfo.color]}>
              {difficultyInfo.label}
            </Badge>
            {pillarInfo && (
              <Badge variant="outline">{pillarInfo.name}</Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {path.topics.length} topics
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {path.estimatedMinutes} min
            </span>
          </div>

          {path.longDescription && (
            <p className="text-sm">{path.longDescription}</p>
          )}
        </div>

        {/* Progress */}
        <PathProgress
          pathSlug={path.slug}
          topics={topics}
          readTopics={progress.readTopics}
          onStart={handleStart}
        />

        {/* Topic List */}
        <div>
          <h2 className="font-semibold mb-3">Topics in this Path</h2>
          <PathTopicList
            topics={topics}
            readTopics={progress.readTopics}
            pathSlug={path.slug}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/\(main\)/paths/[slug]/page.tsx
git commit -m "feat(paths): add path detail page"
```

---

## Task 11: PathTopicSelector Component

**Files:**
- Create: `components/paths/PathTopicSelector.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/paths/PathTopicSelector.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Plus, X, Search } from 'lucide-react';
import type { TopicIndexEntry } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PathTopicSelectorProps {
  selectedTopics: string[];
  onChange: (topics: string[]) => void;
}

export function PathTopicSelector({ selectedTopics, onChange }: PathTopicSelectorProps) {
  const [allTopics, setAllTopics] = useState<TopicIndexEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch('/api/topics?status=published');
        if (res.ok) {
          const data = await res.json();
          setAllTopics(data.topics);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  const selectedTopicData = selectedTopics
    .map(slug => allTopics.find(t => t.slug === slug))
    .filter(Boolean) as TopicIndexEntry[];

  const availableTopics = allTopics.filter(
    t => !selectedTopics.includes(t.slug) &&
      (search === '' || t.title.toLowerCase().includes(search.toLowerCase()))
  );

  const addTopic = (slug: string) => {
    onChange([...selectedTopics, slug]);
  };

  const removeTopic = (slug: string) => {
    onChange(selectedTopics.filter(s => s !== slug));
  };

  const moveTopic = (fromIndex: number, toIndex: number) => {
    const newTopics = [...selectedTopics];
    const [removed] = newTopics.splice(fromIndex, 1);
    newTopics.splice(toIndex, 0, removed);
    onChange(newTopics);
  };

  return (
    <div className="space-y-4">
      {/* Selected Topics */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Selected Topics ({selectedTopics.length})
        </label>
        {selectedTopicData.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
            No topics selected. Add topics from below.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedTopicData.map((topic, index) => (
              <Card key={topic.slug}>
                <CardContent className="flex items-center gap-3 py-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => index > 0 && moveTopic(index, index - 1)}
                      disabled={index === 0}
                    >
                      <span className="text-xs">↑</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => index < selectedTopics.length - 1 && moveTopic(index, index + 1)}
                      disabled={index === selectedTopics.length - 1}
                    >
                      <span className="text-xs">↓</span>
                    </Button>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{topic.title}</p>
                    <Badge variant="secondary" className="text-xs">
                      {PILLAR_INFO[topic.pillar].name}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTopic(topic.slug)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Topics */}
      <div>
        <label className="text-sm font-medium mb-2 block">Add Topics</label>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading topics...</p>
        ) : availableTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {search ? 'No matching topics found.' : 'All topics have been added.'}
          </p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-1 border rounded-md p-2">
            {availableTopics.map(topic => (
              <button
                key={topic.slug}
                onClick={() => addTopic(topic.slug)}
                className="w-full text-left p-2 rounded hover:bg-muted flex items-center gap-2"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate text-sm">{topic.title}</span>
                <Badge variant="outline" className="text-xs">
                  {PILLAR_INFO[topic.pillar].name}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add components/paths/PathTopicSelector.tsx
git commit -m "feat(paths): add PathTopicSelector component"
```

---

## Task 12: PathEditor Component

**Files:**
- Create: `components/paths/PathEditor.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/paths/PathEditor.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PathTopicSelector } from './PathTopicSelector';
import type { LearningPath, PathDifficulty } from '@/lib/paths/types';
import type { Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface PathEditorProps {
  path?: LearningPath;
  onSave: (data: Partial<LearningPath>) => Promise<void>;
  onCancel: () => void;
}

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];
const difficulties: PathDifficulty[] = ['beginner', 'intermediate', 'advanced'];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function PathEditor({ path, onSave, onCancel }: PathEditorProps) {
  const [title, setTitle] = useState(path?.title || '');
  const [slug, setSlug] = useState(path?.slug || '');
  const [description, setDescription] = useState(path?.description || '');
  const [longDescription, setLongDescription] = useState(path?.longDescription || '');
  const [pillar, setPillar] = useState<Pillar | ''>(path?.pillar || '');
  const [difficulty, setDifficulty] = useState<PathDifficulty>(path?.difficulty || 'beginner');
  const [estimatedMinutes, setEstimatedMinutes] = useState(path?.estimatedMinutes || 30);
  const [topics, setTopics] = useState<string[]>(path?.topics || []);
  const [status, setStatus] = useState<'draft' | 'published'>(path?.status || 'draft');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!path && title) {
      setSlug(generateSlug(title));
    }
  }, [title, path]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        title,
        slug,
        description,
        longDescription: longDescription || undefined,
        pillar: pillar || undefined,
        difficulty,
        estimatedMinutes,
        topics,
        status,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Understanding Biblical Prophecy"
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="understanding-biblical-prophecy"
            required
            disabled={!!path}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="A short description for the path card..."
            rows={2}
            required
          />
        </div>

        <div>
          <Label htmlFor="longDescription">Long Description (optional)</Label>
          <Textarea
            id="longDescription"
            value={longDescription}
            onChange={e => setLongDescription(e.target.value)}
            placeholder="A more detailed introduction shown on the path detail page..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pillar">Primary Pillar (optional)</Label>
            <Select value={pillar} onValueChange={(v) => setPillar(v as Pillar | '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {pillars.map(p => (
                  <SelectItem key={p} value={p}>
                    {PILLAR_INFO[p].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as PathDifficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(d => (
                  <SelectItem key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estimatedMinutes">Estimated Time (minutes)</Label>
            <Input
              id="estimatedMinutes"
              type="number"
              value={estimatedMinutes}
              onChange={e => setEstimatedMinutes(Number(e.target.value))}
              min={1}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'draft' | 'published')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Topics</Label>
          <PathTopicSelector
            selectedTopics={topics}
            onChange={setTopics}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : path ? 'Update Path' : 'Create Path'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add components/paths/PathEditor.tsx
git commit -m "feat(paths): add PathEditor component"
```

---

## Task 13: Admin Paths List Page

**Files:**
- Create: `app/(main)/admin/paths/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
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
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/\(main\)/admin/paths/page.tsx
git commit -m "feat(paths): add admin paths list page"
```

---

## Task 14: Create Path Page

**Files:**
- Create: `app/(main)/admin/paths/new/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
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
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/\(main\)/admin/paths/new/page.tsx
git commit -m "feat(paths): add create path page"
```

---

## Task 15: Edit Path Page

**Files:**
- Create: `app/(main)/admin/paths/[slug]/edit/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
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
```

- [ ] **Step 2: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/\(main\)/admin/paths/[slug]/edit/page.tsx
git commit -m "feat(paths): add edit path page"
```

---

## Task 16: Add Paths Section to Home Page

**Files:**
- Modify: `app/(main)/page.tsx`

- [ ] **Step 1: Add imports**

Add to imports:

```typescript
import { Route } from 'lucide-react';
import { PathCard } from '@/components/paths/PathCard';
import type { PathIndexEntry } from '@/lib/paths/types';
```

- [ ] **Step 2: Add state for paths**

Add inside the component:

```typescript
const [paths, setPaths] = useState<PathIndexEntry[]>([]);
const [pathTopics, setPathTopics] = useState<Record<string, string[]>>({});
```

- [ ] **Step 3: Add useEffect to fetch paths**

Add a useEffect to fetch paths after onboarding check:

```typescript
useEffect(() => {
  async function fetchPaths() {
    try {
      const res = await fetch('/api/paths?status=published');
      if (res.ok) {
        const data = await res.json();
        setPaths(data.paths.slice(0, 3));

        // Fetch topics for each path
        const topicsMap: Record<string, string[]> = {};
        for (const path of data.paths.slice(0, 3)) {
          const pathRes = await fetch(`/api/paths/${path.slug}`);
          if (pathRes.ok) {
            const pathData = await pathRes.json();
            topicsMap[path.slug] = pathData.path.topics;
          }
        }
        setPathTopics(topicsMap);
      }
    } catch (error) {
      console.error('Failed to fetch paths:', error);
    }
  }

  if (preferences.hasCompletedOnboarding) {
    fetchPaths();
  }
}, [preferences.hasCompletedOnboarding]);
```

- [ ] **Step 4: Add paths section before Quick Actions**

Add this section after the Continue Reading section and before Quick Actions:

```typescript
{/* Learning Paths */}
{paths.length > 0 && (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Route className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Learning Paths</h3>
      </div>
      <Link href="/paths">
        <Button variant="ghost" size="sm">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>
    <div className="space-y-3">
      {paths.map(path => {
        const topics = pathTopics[path.slug] || [];
        const completedTopics = topics.filter(t =>
          progress.readTopics.includes(t)
        ).length;
        const isStarted = completedTopics > 0;
        const isCompleted = completedTopics === topics.length && topics.length > 0;

        return (
          <PathCard
            key={path.slug}
            path={path}
            progress={{
              completedTopics,
              totalTopics: topics.length,
              isStarted,
              isCompleted,
            }}
          />
        );
      })}
    </div>
  </div>
)}
```

- [ ] **Step 5: Add progress from context**

Update the component to get progress:

```typescript
const { getRecentlyRead, progress } = useTopicProgress();
```

- [ ] **Step 6: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add app/\(main\)/page.tsx
git commit -m "feat(paths): add learning paths section to home page"
```

---

## Task 17: Add Paths Link to Admin Dashboard

**Files:**
- Modify: `app/(main)/admin/page.tsx`

- [ ] **Step 1: Read current admin page**

Read the current admin page to understand its structure.

- [ ] **Step 2: Add paths link to admin dashboard**

Add a "Manage Paths" card/link alongside "Manage Topics":

```typescript
<Link href="/admin/paths">
  <Card className="hover:shadow-md transition-shadow cursor-pointer">
    <CardContent className="flex items-center gap-4 py-6">
      <Route className="h-8 w-8 text-primary" />
      <div>
        <h3 className="font-semibold">Manage Paths</h3>
        <p className="text-sm text-muted-foreground">
          Create and edit learning paths
        </p>
      </div>
    </CardContent>
  </Card>
</Link>
```

Add `Route` to lucide-react imports.

- [ ] **Step 3: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/admin/page.tsx
git commit -m "feat(paths): add paths link to admin dashboard"
```

---

## Task 18: Add Paths Progress to Progress Page

**Files:**
- Modify: `app/(main)/progress/page.tsx`

- [ ] **Step 1: Add imports**

Add to imports:

```typescript
import { Route } from 'lucide-react';
import { PathCard } from '@/components/paths/PathCard';
import type { PathIndexEntry } from '@/lib/paths/types';
```

- [ ] **Step 2: Add state for paths**

Add inside the component:

```typescript
const [paths, setPaths] = useState<PathIndexEntry[]>([]);
const [pathTopics, setPathTopics] = useState<Record<string, string[]>>({});
```

- [ ] **Step 3: Add useEffect to fetch paths**

Add inside the existing useEffect or create new one:

```typescript
useEffect(() => {
  async function loadPaths() {
    try {
      const res = await fetch('/api/paths?status=published');
      if (res.ok) {
        const data = await res.json();
        setPaths(data.paths);

        const topicsMap: Record<string, string[]> = {};
        for (const path of data.paths) {
          const pathRes = await fetch(`/api/paths/${path.slug}`);
          if (pathRes.ok) {
            const pathData = await pathRes.json();
            topicsMap[path.slug] = pathData.path.topics;
          }
        }
        setPathTopics(topicsMap);
      }
    } catch (error) {
      console.error('Failed to load paths:', error);
    }
  }

  loadPaths();
}, []);
```

- [ ] **Step 4: Get progress from context**

Update the hook:

```typescript
const { isRead, markAsUnread, progress } = useTopicProgress();
```

- [ ] **Step 5: Add paths section after overview stats**

Add after the overview Card and before the loading check:

```typescript
{/* Path Progress */}
{paths.length > 0 && (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="font-semibold flex items-center gap-2">
        <Route className="h-4 w-4" />
        Learning Paths
      </h2>
      <Link href="/paths">
        <Button variant="ghost" size="sm">View All</Button>
      </Link>
    </div>
    <div className="space-y-2">
      {paths.slice(0, 3).map(path => {
        const topics = pathTopics[path.slug] || [];
        const completedTopics = topics.filter(t =>
          progress.readTopics.includes(t)
        ).length;
        const isStarted = completedTopics > 0;
        const isCompleted = completedTopics === topics.length && topics.length > 0;

        return (
          <PathCard
            key={path.slug}
            path={path}
            progress={{
              completedTopics,
              totalTopics: topics.length,
              isStarted,
              isCompleted,
            }}
          />
        );
      })}
    </div>
  </div>
)}
```

- [ ] **Step 6: Verify build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build 2>&1 | head -30`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add app/\(main\)/progress/page.tsx
git commit -m "feat(paths): add paths progress to progress page"
```

---

## Task 19: Final Build Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run full build**

Run: `cd /c/Users/tyson/Projects/scripture-explorer && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Verify all routes**

Check that all new routes are listed in build output:
- `/paths`
- `/paths/[slug]`
- `/admin/paths`
- `/admin/paths/new`
- `/admin/paths/[slug]/edit`
- `/api/paths`
- `/api/paths/[slug]`

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(paths): complete learning paths implementation"
```

---

## Verification Checklist

After implementation, verify:

1. ✅ Admin can create a new path with selected topics
2. ✅ Admin can reorder topics in a path
3. ✅ Admin can publish/unpublish paths
4. ✅ User can browse published paths at /paths
5. ✅ User can view path details and topic list
6. ✅ Reading topics updates path progress
7. ✅ Completing all topics shows path as completed
8. ✅ Home page shows learning paths section
9. ✅ Progress page shows path progress
10. ✅ Path detail page shows "Continue" button to next unread topic
