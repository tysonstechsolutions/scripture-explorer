# Learning Platform Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation for Scripture Explorer's learning platform with topic infrastructure, admin content creation, and reader experience.

**Architecture:** File-based JSON storage for topics organized by pillar, Next.js API routes for CRUD operations, AI-powered draft generation using existing Anthropic client, and a three-layer reading UI (hook/overview/deep-dive).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Anthropic Claude API, localStorage for admin state and reading progress.

---

## File Structure

### New Files to Create

```
lib/topics/
  types.ts              # Topic, DeepDiveSection, ScriptureRef interfaces
  storage.ts            # File-based JSON read/write operations
  index.ts              # Index management and querying

content/topics/
  index.json            # Topic index for fast listing
  text/                 # Text & Transmission pillar topics
  prophecy/             # Prophecy & Fulfillment pillar topics
  church/               # Church & Empire pillar topics
  judaism/              # Christianity & Judaism pillar topics
  branches/             # Branches & Beliefs pillar topics

app/api/topics/
  route.ts              # GET (list), POST (create)
  [slug]/route.ts       # GET, PUT, DELETE single topic

app/api/generate-topic/
  route.ts              # POST - AI draft generation

contexts/
  AdminContext.tsx      # Admin mode state management
  TopicProgressContext.tsx  # Read/unread tracking

components/topics/
  TopicCard.tsx         # Hook display for listings
  TopicArticle.tsx      # Full article with three layers
  DeepDiveSection.tsx   # Expandable deep-dive section
  TopicEditor.tsx       # Admin editing interface
  GenerateTopicForm.tsx # AI generation form

components/scripture/
  ScripturePanel.tsx    # Slide-up scripture viewer

app/(main)/
  page.tsx              # Updated home with pillars (modify existing)
  explore/page.tsx      # Topic listing with filters
  explore/[slug]/page.tsx   # Topic reader
  admin/page.tsx        # Admin dashboard
  admin/topics/page.tsx # Topic management
  admin/topics/new/page.tsx # Create new topic
  admin/topics/[slug]/edit/page.tsx # Edit topic
```

### Files to Modify

```
app/(main)/layout.tsx   # Add AdminContext provider
components/layout/BottomNav.tsx  # Update navigation items
contexts/UserDataContext.tsx     # May extend for topic progress (or use separate context)
```

---

## Task 1: Topic Type Definitions

**Files:**
- Create: `lib/topics/types.ts`

- [ ] **Step 1: Create the types file with Topic interface**

```typescript
// lib/topics/types.ts

export type Pillar = 'text' | 'prophecy' | 'church' | 'judaism' | 'branches';

export interface ScriptureRef {
  bookId: string;    // Uses existing API.Bible format (e.g., "GEN", "JHN")
  chapter: number;
  verse: number;
  verseEnd?: number; // For ranges like "John 3:16-17"
}

export interface DeepDiveSection {
  id: string;
  title: string;
  content: string; // markdown
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  pillar: Pillar;
  status: 'draft' | 'review' | 'published';
  hook: string;
  overview: string; // markdown
  deepDive: DeepDiveSection[];
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[]; // topic slugs
  timelineEra?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopicIndexEntry {
  slug: string;
  title: string;
  pillar: Pillar;
  status: 'draft' | 'review' | 'published';
  hook: string;
  updatedAt: string;
}

export interface TopicIndex {
  topics: TopicIndexEntry[];
  lastUpdated: string;
}

export const PILLAR_INFO: Record<Pillar, { name: string; description: string; color: string }> = {
  text: {
    name: 'Text & Transmission',
    description: 'How we got the Bible. Manuscripts, translations, textual variants, reliability evidence.',
    color: 'blue',
  },
  prophecy: {
    name: 'Prophecy & Fulfillment',
    description: 'Predictions examined. Dating debates, fulfilled vs. unfulfilled, the self-fulfilling prophecy question.',
    color: 'purple',
  },
  church: {
    name: 'Church & Empire',
    description: 'How Christianity became an institution. Councils, schisms, Crusades, Reformation, historical atrocities.',
    color: 'amber',
  },
  judaism: {
    name: 'Christianity & Judaism',
    description: 'Jewish roots, the parting of ways, Christian antisemitism, the Holocaust, modern dialogue.',
    color: 'green',
  },
  branches: {
    name: 'Branches & Beliefs',
    description: 'Denominations explained. Why they split, what they disagree on, the landscape today.',
    color: 'red',
  },
};
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd C:\Users\tyson\Projects\scripture-explorer && npx tsc lib/topics/types.ts --noEmit --skipLibCheck`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/topics/types.ts
git commit -m "feat: add Topic type definitions for learning platform"
```

---

## Task 2: Topic Storage Layer

**Files:**
- Create: `lib/topics/storage.ts`
- Create: `content/topics/index.json`
- Create: `content/topics/text/.gitkeep`
- Create: `content/topics/prophecy/.gitkeep`
- Create: `content/topics/church/.gitkeep`
- Create: `content/topics/judaism/.gitkeep`
- Create: `content/topics/branches/.gitkeep`

- [ ] **Step 1: Create the content directory structure**

```bash
cd C:\Users\tyson\Projects\scripture-explorer
mkdir -p content/topics/text content/topics/prophecy content/topics/church content/topics/judaism content/topics/branches
```

- [ ] **Step 2: Create empty index.json**

```json
{
  "topics": [],
  "lastUpdated": "2026-03-26T00:00:00.000Z"
}
```

Save to: `content/topics/index.json`

- [ ] **Step 3: Create .gitkeep files for empty directories**

```bash
touch content/topics/text/.gitkeep
touch content/topics/prophecy/.gitkeep
touch content/topics/church/.gitkeep
touch content/topics/judaism/.gitkeep
touch content/topics/branches/.gitkeep
```

- [ ] **Step 4: Create storage.ts with file operations**

```typescript
// lib/topics/storage.ts

import { promises as fs } from 'fs';
import path from 'path';
import type { Topic, TopicIndex, TopicIndexEntry, Pillar } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'topics');
const INDEX_PATH = path.join(CONTENT_DIR, 'index.json');

function getTopicPath(pillar: Pillar, slug: string): string {
  return path.join(CONTENT_DIR, pillar, `${slug}.json`);
}

export async function readIndex(): Promise<TopicIndex> {
  try {
    const data = await fs.readFile(INDEX_PATH, 'utf-8');
    return JSON.parse(data) as TopicIndex;
  } catch {
    return { topics: [], lastUpdated: new Date().toISOString() };
  }
}

export async function writeIndex(index: TopicIndex): Promise<void> {
  index.lastUpdated = new Date().toISOString();
  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2), 'utf-8');
}

export async function readTopic(pillar: Pillar, slug: string): Promise<Topic | null> {
  try {
    const filePath = getTopicPath(pillar, slug);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Topic;
  } catch {
    return null;
  }
}

export async function writeTopic(topic: Topic): Promise<void> {
  const filePath = getTopicPath(topic.pillar, topic.slug);
  await fs.writeFile(filePath, JSON.stringify(topic, null, 2), 'utf-8');

  // Update index
  const index = await readIndex();
  const entry: TopicIndexEntry = {
    slug: topic.slug,
    title: topic.title,
    pillar: topic.pillar,
    status: topic.status,
    hook: topic.hook,
    updatedAt: topic.updatedAt,
  };

  const existingIdx = index.topics.findIndex(t => t.slug === topic.slug);
  if (existingIdx >= 0) {
    index.topics[existingIdx] = entry;
  } else {
    index.topics.push(entry);
  }

  await writeIndex(index);
}

export async function deleteTopic(pillar: Pillar, slug: string): Promise<boolean> {
  try {
    const filePath = getTopicPath(pillar, slug);
    await fs.unlink(filePath);

    // Update index
    const index = await readIndex();
    index.topics = index.topics.filter(t => t.slug !== slug);
    await writeIndex(index);

    return true;
  } catch {
    return false;
  }
}

export async function findTopicBySlug(slug: string): Promise<{ topic: Topic; pillar: Pillar } | null> {
  const index = await readIndex();
  const entry = index.topics.find(t => t.slug === slug);
  if (!entry) return null;

  const topic = await readTopic(entry.pillar, slug);
  if (!topic) return null;

  return { topic, pillar: entry.pillar };
}

export async function listTopics(options?: {
  pillar?: Pillar;
  status?: 'draft' | 'review' | 'published';
}): Promise<TopicIndexEntry[]> {
  const index = await readIndex();
  let topics = index.topics;

  if (options?.pillar) {
    topics = topics.filter(t => t.pillar === options.pillar);
  }
  if (options?.status) {
    topics = topics.filter(t => t.status === options.status);
  }

  return topics;
}
```

- [ ] **Step 5: Verify storage module compiles**

Run: `cd C:\Users\tyson\Projects\scripture-explorer && npx tsc lib/topics/storage.ts --noEmit --skipLibCheck --esModuleInterop`

Expected: No errors (or only errors about missing module resolution which are expected in isolation)

- [ ] **Step 6: Commit**

```bash
git add lib/topics/ content/topics/
git commit -m "feat: add topic storage layer with file-based JSON persistence"
```

---

## Task 3: Topic API Routes - List and Create

**Files:**
- Create: `app/api/topics/route.ts`

- [ ] **Step 1: Create the topics list/create API route**

```typescript
// app/api/topics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { listTopics, writeTopic, readIndex } from '@/lib/topics/storage';
import type { Topic, Pillar } from '@/lib/topics/types';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pillar = searchParams.get('pillar') as Pillar | null;
  const status = searchParams.get('status') as 'draft' | 'review' | 'published' | null;

  try {
    const topics = await listTopics({
      pillar: pillar || undefined,
      status: status || undefined,
    });

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error listing topics:', error);
    return NextResponse.json(
      { error: 'Failed to list topics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, pillar, hook, overview, deepDive, scriptureRefs, relatedTopics, timelineEra } = body;

    if (!title || !pillar || !hook || !overview) {
      return NextResponse.json(
        { error: 'Missing required fields: title, pillar, hook, overview' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const index = await readIndex();
    if (index.topics.some(t => t.slug === slug)) {
      return NextResponse.json(
        { error: 'A topic with this title already exists' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const topic: Topic = {
      id: nanoid(),
      slug,
      title,
      pillar,
      status: 'draft',
      hook,
      overview,
      deepDive: deepDive || [],
      scriptureRefs: scriptureRefs || [],
      relatedTopics: relatedTopics || [],
      timelineEra,
      createdAt: now,
      updatedAt: now,
    };

    await writeTopic(topic);

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Install nanoid if not present**

Run: `cd C:\Users\tyson\Projects\scripture-explorer && npm ls nanoid || npm install nanoid`

Expected: nanoid installed or already present

- [ ] **Step 3: Verify API route compiles**

Run: `cd C:\Users\tyson\Projects\scripture-explorer && npx tsc app/api/topics/route.ts --noEmit --skipLibCheck`

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/api/topics/route.ts package.json package-lock.json
git commit -m "feat: add topics API route for listing and creating topics"
```

---

## Task 4: Topic API Routes - Single Topic Operations

**Files:**
- Create: `app/api/topics/[slug]/route.ts`

- [ ] **Step 1: Create the single topic API route**

```typescript
// app/api/topics/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { findTopicBySlug, writeTopic, deleteTopic } from '@/lib/topics/storage';
import type { Topic } from '@/lib/topics/types';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const result = await findTopicBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ topic: result.topic });
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const result = await findTopicBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, hook, overview, deepDive, scriptureRefs, relatedTopics, timelineEra, status } = body;

    const updatedTopic: Topic = {
      ...result.topic,
      title: title ?? result.topic.title,
      hook: hook ?? result.topic.hook,
      overview: overview ?? result.topic.overview,
      deepDive: deepDive ?? result.topic.deepDive,
      scriptureRefs: scriptureRefs ?? result.topic.scriptureRefs,
      relatedTopics: relatedTopics ?? result.topic.relatedTopics,
      timelineEra: timelineEra !== undefined ? timelineEra : result.topic.timelineEra,
      status: status ?? result.topic.status,
      updatedAt: new Date().toISOString(),
    };

    await writeTopic(updatedTopic);

    return NextResponse.json({ topic: updatedTopic });
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const result = await findTopicBySlug(slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const deleted = await deleteTopic(result.pillar, slug);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete topic' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify API route compiles**

Run: `cd C:\Users\tyson\Projects\scripture-explorer && npx tsc app/api/topics/[slug]/route.ts --noEmit --skipLibCheck`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/api/topics/[slug]/route.ts
git commit -m "feat: add single topic API routes for GET, PUT, DELETE"
```

---

## Task 5: AI Topic Generation API

**Files:**
- Create: `app/api/generate-topic/route.ts`
- Create: `lib/topics/prompts.ts`

- [ ] **Step 1: Create the topic generation prompt template**

```typescript
// lib/topics/prompts.ts

import type { Pillar } from './types';
import { PILLAR_INFO } from './types';

export function buildTopicGenerationPrompt(
  title: string,
  pillar: Pillar,
  context?: string
): string {
  const pillarInfo = PILLAR_INFO[pillar];

  return `You are helping create educational content about biblical history and scholarship.

Generate a topic entry with three layers:

TOPIC: ${title}
PILLAR: ${pillarInfo.name} - ${pillarInfo.description}
${context ? `CONTEXT: ${context}` : ''}

## Layer 1: Hook (2-3 sentences)
Write a compelling hook that:
- Summarizes what this topic is about
- Explains why it matters or why skeptics raise it
- Creates curiosity to learn more

## Layer 2: Overview (800-1200 words)
Write an accessible overview that:
- Explains what happened or what the evidence shows
- Presents the main scholarly positions fairly
- Addresses common objections honestly
- Provides clear takeaways
- Uses headers to organize sections

## Layer 3: Deep Dive Sections
Create 3-5 expandable sections for deeper exploration:
- Include primary source quotes where relevant
- Cite scholarly sources (author, work, year)
- Address specific "but what about..." objections
- Suggest connections to related topics

TONE: Intellectually honest. Present evidence fairly, including challenges.
Don't be defensive or preachy. Let the evidence speak.

OUTPUT FORMAT: Return valid JSON matching this exact structure:
{
  "hook": "string - the 2-3 sentence hook",
  "overview": "string - the full overview in markdown format",
  "deepDive": [
    {
      "id": "string - unique id like 'section-1'",
      "title": "string - section title",
      "content": "string - section content in markdown"
    }
  ],
  "scriptureRefs": [
    {
      "bookId": "string - API.Bible format like 'GEN' or 'JHN'",
      "chapter": number,
      "verse": number,
      "verseEnd": number | null
    }
  ],
  "relatedTopics": ["string - suggested related topic titles"]
}

Return ONLY the JSON object, no markdown code blocks or other text.`;
}
```

- [ ] **Step 2: Create the generate-topic API route**

```typescript
// app/api/generate-topic/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/ai/client';
import { buildTopicGenerationPrompt } from '@/lib/topics/prompts';
import type { Pillar, DeepDiveSection, ScriptureRef } from '@/lib/topics/types';

interface GeneratedContent {
  hook: string;
  overview: string;
  deepDive: DeepDiveSection[];
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, pillar, context } = body as {
      title: string;
      pillar: Pillar;
      context?: string;
    };

    if (!title || !pillar) {
      return NextResponse.json(
        { error: 'Missing required fields: title, pillar' },
        { status: 400 }
      );
    }

    const prompt = buildTopicGenerationPrompt(title, pillar, context);
    const client = getAnthropicClient();

    let lastError: Error | null = null;

    // Retry once on failure
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const textContent = response.content.find(c => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
          throw new Error('No text content in response');
        }

        // Parse the JSON response
        let content: GeneratedContent;
        try {
          content = JSON.parse(textContent.text);
        } catch {
          // Try to extract JSON from markdown code block if present
          const jsonMatch = textContent.text.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            content = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error('Failed to parse response as JSON');
          }
        }

        return NextResponse.json({ content });
      } catch (error) {
        lastError = error as Error;
        console.error(`Generation attempt ${attempt + 1} failed:`, error);
        if (attempt < 1) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    return NextResponse.json(
      { error: `Generation failed after retries: ${lastError?.message}` },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error generating topic:', error);
    return NextResponse.json(
      { error: 'Failed to generate topic content' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Verify both files compile**

Run: `cd C:\Users\tyson\Projects\scripture-explorer && npx tsc lib/topics/prompts.ts app/api/generate-topic/route.ts --noEmit --skipLibCheck`

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/topics/prompts.ts app/api/generate-topic/route.ts
git commit -m "feat: add AI topic generation API with Claude integration"
```

---

## Task 6: Admin Context Provider

**Files:**
- Create: `contexts/AdminContext.tsx`
- Modify: `app/(main)/layout.tsx`

- [ ] **Step 1: Create AdminContext**

```typescript
// contexts/AdminContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const ADMIN_STORAGE_KEY = 'scripture-explorer-admin-mode';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored === 'true') {
      setIsAdmin(true);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(ADMIN_STORAGE_KEY, String(isAdmin));
    }
  }, [isAdmin, mounted]);

  const toggleAdmin = () => {
    setIsAdmin(prev => !prev);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
```

- [ ] **Step 2: Read the existing layout file**

Run: Read `app/(main)/layout.tsx` to see current structure

- [ ] **Step 3: Add AdminProvider to layout**

Wrap the existing children with AdminProvider. The exact edit depends on the current structure, but it should look like:

```typescript
import { AdminProvider } from '@/contexts/AdminContext';

// In the layout component, wrap children:
<AdminProvider>
  {/* existing content */}
</AdminProvider>
```

- [ ] **Step 4: Verify the layout compiles**

Run: `cd C:\Users\tyson\Projects\scripture-explorer && npx tsc app/(main)/layout.tsx --noEmit --skipLibCheck`

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add contexts/AdminContext.tsx app/(main)/layout.tsx
git commit -m "feat: add AdminContext for admin mode toggle"
```

---

## Task 7: Topic Progress Context

**Files:**
- Create: `contexts/TopicProgressContext.tsx`
- Modify: `app/(main)/layout.tsx`

- [ ] **Step 1: Create TopicProgressContext**

```typescript
// contexts/TopicProgressContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TopicProgress {
  readTopics: string[]; // array of slugs
}

interface TopicProgressContextType {
  progress: TopicProgress;
  isRead: (slug: string) => boolean;
  markAsRead: (slug: string) => void;
  markAsUnread: (slug: string) => void;
}

const TopicProgressContext = createContext<TopicProgressContextType | null>(null);

const PROGRESS_STORAGE_KEY = 'scripture-explorer-topic-progress';

export function TopicProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<TopicProgress>({ readTopics: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch {
        // Invalid stored data, use default
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, mounted]);

  const isRead = (slug: string) => progress.readTopics.includes(slug);

  const markAsRead = (slug: string) => {
    setProgress(prev => {
      if (prev.readTopics.includes(slug)) return prev;
      return { ...prev, readTopics: [...prev.readTopics, slug] };
    });
  };

  const markAsUnread = (slug: string) => {
    setProgress(prev => ({
      ...prev,
      readTopics: prev.readTopics.filter(s => s !== slug),
    }));
  };

  return (
    <TopicProgressContext.Provider value={{ progress, isRead, markAsRead, markAsUnread }}>
      {children}
    </TopicProgressContext.Provider>
  );
}

export function useTopicProgress(): TopicProgressContextType {
  const context = useContext(TopicProgressContext);
  if (!context) {
    throw new Error('useTopicProgress must be used within a TopicProgressProvider');
  }
  return context;
}
```

- [ ] **Step 2: Add TopicProgressProvider to layout**

Add alongside AdminProvider in `app/(main)/layout.tsx`:

```typescript
import { TopicProgressProvider } from '@/contexts/TopicProgressContext';

// Wrap children with both providers:
<AdminProvider>
  <TopicProgressProvider>
    {/* existing content */}
  </TopicProgressProvider>
</AdminProvider>
```

- [ ] **Step 3: Commit**

```bash
git add contexts/TopicProgressContext.tsx app/(main)/layout.tsx
git commit -m "feat: add TopicProgressContext for read/unread tracking"
```

---

## Task 8: TopicCard Component

**Files:**
- Create: `components/topics/TopicCard.tsx`

- [ ] **Step 1: Create the TopicCard component**

```typescript
// components/topics/TopicCard.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import { useAdmin } from '@/contexts/AdminContext';
import type { TopicIndexEntry, Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface TopicCardProps {
  topic: TopicIndexEntry;
}

const pillarColorMap: Record<Pillar, string> = {
  text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  prophecy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  church: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  judaism: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  branches: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColorMap = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export function TopicCard({ topic }: TopicCardProps) {
  const { isRead } = useTopicProgress();
  const { isAdmin } = useAdmin();
  const read = isRead(topic.slug);
  const pillarInfo = PILLAR_INFO[topic.pillar];

  // Don't show drafts to non-admin users
  if (topic.status !== 'published' && !isAdmin) {
    return null;
  }

  return (
    <Link href={`/explore/${topic.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{topic.title}</CardTitle>
            {read && (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="secondary" className={pillarColorMap[topic.pillar]}>
              {pillarInfo.name}
            </Badge>
            {isAdmin && topic.status !== 'published' && (
              <Badge variant="secondary" className={statusColorMap[topic.status]}>
                {topic.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {topic.hook}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: Verify component compiles**

Run: `cd C:\Users\tyson\Projects\scripture-explorer && npx tsc components/topics/TopicCard.tsx --noEmit --skipLibCheck`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/topics/TopicCard.tsx
git commit -m "feat: add TopicCard component for topic listings"
```

---

## Task 9: DeepDiveSection Component

**Files:**
- Create: `components/topics/DeepDiveSection.tsx`

- [ ] **Step 1: Create the DeepDiveSection component**

```typescript
// components/topics/DeepDiveSection.tsx

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DeepDiveSection as DeepDiveSectionType } from '@/lib/topics/types';

interface DeepDiveSectionProps {
  section: DeepDiveSectionType;
}

export function DeepDiveSection({ section }: DeepDiveSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-4 text-left h-auto"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold">{section.title}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0" />
        )}
      </Button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/topics/DeepDiveSection.tsx
git commit -m "feat: add DeepDiveSection expandable component"
```

---

## Task 10: TopicArticle Component

**Files:**
- Create: `components/topics/TopicArticle.tsx`

- [ ] **Step 1: Create the TopicArticle component**

```typescript
// components/topics/TopicArticle.tsx

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, CheckCircle2 } from 'lucide-react';
import { DeepDiveSection } from './DeepDiveSection';
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
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/topics/TopicArticle.tsx
git commit -m "feat: add TopicArticle component with three-layer display"
```

---

## Task 11: Explore Page (Topic Listing)

**Files:**
- Create: `app/(main)/explore/page.tsx`

- [ ] **Step 1: Create the explore page**

```typescript
// app/(main)/explore/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { TopicCard } from '@/components/topics/TopicCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/contexts/AdminContext';
import type { TopicIndexEntry, Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];

export default function ExplorePage() {
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | 'all'>('all');
  const { isAdmin } = useAdmin();

  useEffect(() => {
    async function loadTopics() {
      try {
        const params = new URLSearchParams();
        if (selectedPillar !== 'all') {
          params.set('pillar', selectedPillar);
        }
        // Only show published topics for non-admin users
        if (!isAdmin) {
          params.set('status', 'published');
        }

        const res = await fetch(`/api/topics?${params}`);
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
  }, [selectedPillar, isAdmin]);

  return (
    <div className="pb-20">
      <Header title="Explore" />

      <div className="p-4">
        {/* Pillar Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedPillar === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPillar('all')}
          >
            All
          </Button>
          {pillars.map(pillar => (
            <Button
              key={pillar}
              variant={selectedPillar === pillar ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPillar(pillar)}
            >
              {PILLAR_INFO[pillar].name}
            </Button>
          ))}
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No topics found.</p>
            {isAdmin && (
              <p className="mt-2">
                <a href="/admin/topics/new" className="text-primary underline">
                  Create your first topic
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map(topic => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(main)/explore/page.tsx
git commit -m "feat: add Explore page for topic listing with pillar filter"
```

---

## Task 12: Topic Reader Page

**Files:**
- Create: `app/(main)/explore/[slug]/page.tsx`

- [ ] **Step 1: Create the topic reader page**

```typescript
// app/(main)/explore/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { findTopicBySlug } from '@/lib/topics/storage';
import { TopicArticle } from '@/components/topics/TopicArticle';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await findTopicBySlug(slug);

  if (!result) {
    notFound();
  }

  return (
    <div className="p-4 pb-20">
      <TopicArticle topic={result.topic} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const result = await findTopicBySlug(slug);

  if (!result) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: result.topic.title,
    description: result.topic.hook,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(main)/explore/[slug]/page.tsx
git commit -m "feat: add topic reader page with server-side rendering"
```

---

## Task 13: Admin Dashboard Page

**Files:**
- Create: `app/(main)/admin/page.tsx`

- [ ] **Step 1: Create the admin dashboard page**

```typescript
// app/(main)/admin/page.tsx

'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { FileText, Plus, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { isAdmin, toggleAdmin } = useAdmin();
  const router = useRouter();

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      // Don't redirect, just show a way to enable admin mode
    }
  }, [isAdmin]);

  return (
    <div className="pb-20">
      <Header title="Admin" />

      <div className="p-4 space-y-6">
        {/* Admin Mode Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {isAdmin ? 'Admin mode is ON' : 'Admin mode is OFF'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isAdmin
                    ? 'You can see drafts and edit content'
                    : 'Enable to access content management'}
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleAdmin}
              >
                {isAdmin ? (
                  <ToggleRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/topics/new">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <Plus className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">New Topic</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/topics">
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <FileText className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">Manage Topics</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(main)/admin/page.tsx
git commit -m "feat: add admin dashboard with mode toggle"
```

---

## Task 14: Admin Topics List Page

**Files:**
- Create: `app/(main)/admin/topics/page.tsx`

- [ ] **Step 1: Create the admin topics list page**

```typescript
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
import type { TopicIndexEntry, Pillar } from '@/lib/topics/types';
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
        backHref="/admin"
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
```

- [ ] **Step 2: Commit**

```bash
git add app/(main)/admin/topics/page.tsx
git commit -m "feat: add admin topics list with delete functionality"
```

---

## Task 15: Generate Topic Form Component

**Files:**
- Create: `components/topics/GenerateTopicForm.tsx`

- [ ] **Step 1: Create the generate topic form**

```typescript
// components/topics/GenerateTopicForm.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import type { Pillar, DeepDiveSection, ScriptureRef } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

interface GeneratedContent {
  hook: string;
  overview: string;
  deepDive: DeepDiveSection[];
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[];
}

interface GenerateTopicFormProps {
  onGenerated: (content: GeneratedContent, title: string, pillar: Pillar) => void;
}

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];

export function GenerateTopicForm({ onGenerated }: GenerateTopicFormProps) {
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState<Pillar>('text');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Please enter a topic title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, pillar, context: context || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Generation failed');
      }

      const { content } = await res.json();
      onGenerated(content, title, pillar);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Topic Title</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g., Council of Nicaea"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="pillar">Pillar</Label>
        <Select value={pillar} onValueChange={v => setPillar(v as Pillar)} disabled={loading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pillars.map(p => (
              <SelectItem key={p} value={p}>
                {PILLAR_INFO[p].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="context">Additional Context (optional)</Label>
        <Textarea
          id="context"
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="Any specific objections to address or angles to explore..."
          rows={3}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
          <Button
            variant="link"
            size="sm"
            className="ml-2 p-0 h-auto text-red-600 underline"
            onClick={handleGenerate}
          >
            Try Again
          </Button>
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={loading || !title.trim()}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating (30-60s)...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Draft
          </>
        )}
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/topics/GenerateTopicForm.tsx
git commit -m "feat: add GenerateTopicForm component for AI drafting"
```

---

## Task 16: Topic Editor Component

**Files:**
- Create: `components/topics/TopicEditor.tsx`

- [ ] **Step 1: Create the topic editor**

```typescript
// components/topics/TopicEditor.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Eye, Plus, Trash2 } from 'lucide-react';
import type { Topic, Pillar, DeepDiveSection } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';
import { nanoid } from 'nanoid';

interface TopicEditorProps {
  initialTopic?: Partial<Topic>;
  onSave: (topic: Omit<Topic, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onPreview?: () => void;
}

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];

export function TopicEditor({ initialTopic, onSave, onPreview }: TopicEditorProps) {
  const [title, setTitle] = useState(initialTopic?.title || '');
  const [pillar, setPillar] = useState<Pillar>(initialTopic?.pillar || 'text');
  const [status, setStatus] = useState<'draft' | 'review' | 'published'>(
    initialTopic?.status || 'draft'
  );
  const [hook, setHook] = useState(initialTopic?.hook || '');
  const [overview, setOverview] = useState(initialTopic?.overview || '');
  const [deepDive, setDeepDive] = useState<DeepDiveSection[]>(
    initialTopic?.deepDive || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSection = () => {
    setDeepDive([...deepDive, { id: nanoid(), title: '', content: '' }]);
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setDeepDive(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const removeSection = (id: string) => {
    setDeepDive(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim() || !hook.trim() || !overview.trim()) {
      setError('Title, hook, and overview are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        title,
        pillar,
        status,
        hook,
        overview,
        deepDive,
        scriptureRefs: initialTopic?.scriptureRefs || [],
        relatedTopics: initialTopic?.relatedTopics || [],
        timelineEra: initialTopic?.timelineEra,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Topic title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pillar</Label>
              <Select value={pillar} onValueChange={v => setPillar(v as Pillar)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pillars.map(p => (
                    <SelectItem key={p} value={p}>
                      {PILLAR_INFO[p].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hook */}
      <Card>
        <CardHeader>
          <CardTitle>Hook (Layer 1)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={hook}
            onChange={e => setHook(e.target.value)}
            placeholder="2-3 sentence hook that captures attention..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview (Layer 2)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={overview}
            onChange={e => setOverview(e.target.value)}
            placeholder="Main article content in markdown..."
            rows={15}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Deep Dive Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Deep Dive Sections (Layer 3)</CardTitle>
          <Button variant="outline" size="sm" onClick={addSection}>
            <Plus className="h-4 w-4 mr-1" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {deepDive.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No deep dive sections yet. Click "Add Section" to create one.
            </p>
          ) : (
            deepDive.map((section, index) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Section {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
                <Input
                  value={section.title}
                  onChange={e => updateSection(section.id, 'title', e.target.value)}
                  placeholder="Section title"
                />
                <Textarea
                  value={section.content}
                  onChange={e => updateSection(section.id, 'content', e.target.value)}
                  placeholder="Section content in markdown..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Topic
            </>
          )}
        </Button>
        {onPreview && (
          <Button variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/topics/TopicEditor.tsx
git commit -m "feat: add TopicEditor component for content editing"
```

---

## Task 17: New Topic Page

**Files:**
- Create: `app/(main)/admin/topics/new/page.tsx`

- [ ] **Step 1: Create the new topic page**

```typescript
// app/(main)/admin/topics/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerateTopicForm } from '@/components/topics/GenerateTopicForm';
import { TopicEditor } from '@/components/topics/TopicEditor';
import { useAdmin } from '@/contexts/AdminContext';
import type { Pillar, DeepDiveSection, ScriptureRef, Topic } from '@/lib/topics/types';

interface GeneratedContent {
  hook: string;
  overview: string;
  deepDive: DeepDiveSection[];
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[];
}

export default function NewTopicPage() {
  const [generatedContent, setGeneratedContent] = useState<{
    content: GeneratedContent;
    title: string;
    pillar: Pillar;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  const { isAdmin } = useAdmin();
  const router = useRouter();

  if (!isAdmin) {
    router.push('/admin');
    return null;
  }

  const handleGenerated = (content: GeneratedContent, title: string, pillar: Pillar) => {
    setGeneratedContent({ content, title, pillar });
    setActiveTab('edit');
  };

  const handleSave = async (topicData: Omit<Topic, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create topic');
    }

    const { topic } = await res.json();
    router.push(`/admin/topics/${topic.slug}/edit`);
  };

  const initialTopic = generatedContent
    ? {
        title: generatedContent.title,
        pillar: generatedContent.pillar,
        hook: generatedContent.content.hook,
        overview: generatedContent.content.overview,
        deepDive: generatedContent.content.deepDive,
        scriptureRefs: generatedContent.content.scriptureRefs,
        relatedTopics: generatedContent.content.relatedTopics,
        status: 'draft' as const,
      }
    : undefined;

  return (
    <div className="pb-20">
      <Header title="New Topic" backHref="/admin/topics" />

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'generate' | 'edit')}>
          <TabsList className="w-full">
            <TabsTrigger value="generate" className="flex-1">
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex-1">
              Edit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Topic with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <GenerateTopicForm onGenerated={handleGenerated} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="mt-4">
            <TopicEditor initialTopic={initialTopic} onSave={handleSave} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(main)/admin/topics/new/page.tsx
git commit -m "feat: add new topic page with AI generation and editing"
```

---

## Task 18: Edit Topic Page

**Files:**
- Create: `app/(main)/admin/topics/[slug]/edit/page.tsx`

- [ ] **Step 1: Create the edit topic page**

```typescript
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
      <Header title="Edit Topic" backHref="/admin/topics" />

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
```

- [ ] **Step 2: Commit**

```bash
git add app/(main)/admin/topics/[slug]/edit/page.tsx
git commit -m "feat: add edit topic page"
```

---

## Task 19: Update Home Page with Pillars

**Files:**
- Modify: `app/(main)/page.tsx`

- [ ] **Step 1: Read the current home page**

Read `app/(main)/page.tsx` to understand current structure.

- [ ] **Step 2: Create updated home page with pillars**

The home page should now feature the five pillars as the primary navigation. Replace the current content with:

```typescript
// app/(main)/page.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { useAdmin } from '@/contexts/AdminContext';
import {
  BookOpen,
  ScrollText,
  Church,
  Star,
  GitBranch,
  Settings
} from 'lucide-react';
import type { Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

const pillarIcons: Record<Pillar, React.ReactNode> = {
  text: <ScrollText className="h-8 w-8" />,
  prophecy: <Star className="h-8 w-8" />,
  church: <Church className="h-8 w-8" />,
  judaism: <BookOpen className="h-8 w-8" />,
  branches: <GitBranch className="h-8 w-8" />,
};

const pillarColors: Record<Pillar, string> = {
  text: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
  prophecy: 'border-purple-500 bg-purple-50 dark:bg-purple-950',
  church: 'border-amber-500 bg-amber-50 dark:bg-amber-950',
  judaism: 'border-green-500 bg-green-50 dark:bg-green-950',
  branches: 'border-red-500 bg-red-50 dark:bg-red-950',
};

const pillars: Pillar[] = ['text', 'prophecy', 'church', 'judaism', 'branches'];

export default function HomePage() {
  const { isAdmin } = useAdmin();

  return (
    <div className="pb-20">
      <Header
        title="Scripture Explorer"
        rightAction={
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        }
      />

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-4">
          <h2 className="text-xl font-semibold mb-2">
            Explore Biblical History & Scholarship
          </h2>
          <p className="text-muted-foreground">
            Intellectually honest exploration of hard questions
          </p>
        </div>

        {/* Five Pillars */}
        <div className="space-y-3">
          {pillars.map(pillar => {
            const info = PILLAR_INFO[pillar];
            return (
              <Link key={pillar} href={`/explore?pillar=${pillar}`}>
                <Card
                  className={`border-l-4 ${pillarColors[pillar]} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="text-muted-foreground">
                      {pillarIcons[pillar]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{info.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {info.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/explore">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <BookOpen className="h-8 w-8 mb-2 text-primary" />
                <span className="font-medium">All Topics</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/read">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <ScrollText className="h-8 w-8 mb-2 text-primary" />
                <span className="font-medium">Read Bible</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Admin Quick Access */}
        {isAdmin && (
          <Card className="border-dashed">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary">Admin Mode</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Content management enabled
                  </p>
                </div>
                <Link href="/admin/topics/new">
                  <Button size="sm">New Topic</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/(main)/page.tsx
git commit -m "feat: update home page with five pillars navigation"
```

---

## Task 20: Update Bottom Navigation

**Files:**
- Modify: `components/layout/BottomNav.tsx`

- [ ] **Step 1: Read current BottomNav**

Read `components/layout/BottomNav.tsx` to understand current structure.

- [ ] **Step 2: Update BottomNav with new navigation**

Update to match the spec: Home | Explore | Bible | Progress | Settings

```typescript
// The specific edit depends on current structure, but nav items should be:

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/read', label: 'Bible', icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/admin', label: 'Settings', icon: Settings },
];
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/BottomNav.tsx
git commit -m "feat: update bottom navigation for learning platform"
```

---

## Task 21: Progress Page (Read/Unread Tracking)

**Files:**
- Create: `app/(main)/progress/page.tsx`

- [ ] **Step 1: Create the progress page**

```typescript
// app/(main)/progress/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { useTopicProgress } from '@/contexts/TopicProgressContext';
import type { TopicIndexEntry, Pillar } from '@/lib/topics/types';
import { PILLAR_INFO } from '@/lib/topics/types';

export default function ProgressPage() {
  const [topics, setTopics] = useState<TopicIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { progress, isRead, markAsUnread } = useTopicProgress();

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch('/api/topics?status=published');
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
  }, []);

  const readTopics = topics.filter(t => isRead(t.slug));
  const unreadTopics = topics.filter(t => !isRead(t.slug));
  const readCount = readTopics.length;
  const totalCount = topics.length;
  const percentage = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;

  return (
    <div className="pb-20">
      <Header title="Progress" />

      <div className="p-4 space-y-6">
        {/* Overview Stats */}
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                {readCount} of {totalCount} topics read
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <>
            {/* Unread Topics */}
            {unreadTopics.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Circle className="h-4 w-4" />
                  To Read ({unreadTopics.length})
                </h2>
                <div className="space-y-2">
                  {unreadTopics.map(topic => (
                    <Link key={topic.slug} href={`/explore/${topic.slug}`}>
                      <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium">{topic.title}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {PILLAR_INFO[topic.pillar].name}
                            </Badge>
                          </div>
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Read Topics */}
            {readTopics.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed ({readTopics.length})
                </h2>
                <div className="space-y-2">
                  {readTopics.map(topic => (
                    <Card key={topic.slug}>
                      <CardContent className="flex items-center justify-between py-3">
                        <Link href={`/explore/${topic.slug}`} className="flex-1">
                          <p className="font-medium">{topic.title}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {PILLAR_INFO[topic.pillar].name}
                          </Badge>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsUnread(topic.slug)}
                        >
                          Mark unread
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {totalCount === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No published topics yet.</p>
                <Link href="/explore">
                  <Button variant="link">Go to Explore</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(main)/progress/page.tsx
git commit -m "feat: add progress page for read/unread tracking"
```

---

## Task 22: Scripture Panel Component

**Files:**
- Create: `components/scripture/ScripturePanel.tsx`

- [ ] **Step 1: Create the scripture panel**

```typescript
// components/scripture/ScripturePanel.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { ScriptureRef } from '@/lib/topics/types';
import { getBookById } from '@/lib/bible/books';

interface ScripturePanelProps {
  reference: ScriptureRef | null;
  isOpen: boolean;
  onClose: () => void;
}

interface VerseData {
  bookName: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
  text: string;
}

export function ScripturePanel({ reference, isOpen, onClose }: ScripturePanelProps) {
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference || !isOpen) {
      setVerseData(null);
      return;
    }

    async function fetchVerse() {
      setLoading(true);
      setError(null);

      try {
        const book = getBookById(reference.bookId);
        if (!book) {
          throw new Error('Book not found');
        }

        const params = new URLSearchParams({
          book: book.id,
          chapter: String(reference.chapter),
          verse: String(reference.verse),
        });

        const res = await fetch(`/api/bible?${params}`);
        if (!res.ok) {
          throw new Error('Failed to fetch verse');
        }

        const data = await res.json();

        setVerseData({
          bookName: book.name,
          chapter: reference.chapter,
          verse: reference.verse,
          verseEnd: reference.verseEnd,
          text: data.content || data.text || 'Verse text not available',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load verse');
      } finally {
        setLoading(false);
      }
    }

    fetchVerse();
  }, [reference, isOpen]);

  const book = reference ? getBookById(reference.bookId) : null;
  const referenceText = reference && book
    ? `${book.name} ${reference.chapter}:${reference.verse}${reference.verseEnd ? `-${reference.verseEnd}` : ''}`
    : '';

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>{referenceText || 'Scripture'}</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : verseData ? (
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">{verseData.text}</p>

              {book && (
                <Link
                  href={`/read/${book.id.toLowerCase()}/${reference?.chapter}`}
                  onClick={onClose}
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read full chapter
                  </Button>
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/scripture/ScripturePanel.tsx
git commit -m "feat: add ScripturePanel slide-up component"
```

---

## Task 23: Integration Test - Full Flow

**Files:**
- None (manual testing)

- [ ] **Step 1: Start the dev server**

```bash
cd C:\Users\tyson\Projects\scripture-explorer && npm run dev
```

- [ ] **Step 2: Test the admin flow**

1. Navigate to `/admin`
2. Toggle admin mode ON
3. Go to `/admin/topics/new`
4. Generate a topic using AI (e.g., "Council of Nicaea" in "Church & Empire")
5. Review and save the generated draft
6. Change status to "published"
7. View the topic at `/explore/{slug}`

- [ ] **Step 3: Test the reader flow**

1. Navigate to home page `/`
2. Click a pillar to filter topics
3. Open a topic and read it
4. Check that progress is tracked at `/progress`

- [ ] **Step 4: Verify features work**

Checklist:
- [ ] Admin mode toggle persists across page loads
- [ ] AI generation produces valid topic content
- [ ] Topics are saved to file system
- [ ] Explore page filters by pillar
- [ ] Topic article displays all three layers
- [ ] Progress page shows read/unread correctly
- [ ] Bottom navigation works correctly

- [ ] **Step 5: Commit any fixes needed**

```bash
git add -A
git commit -m "fix: address issues found during integration testing"
```

---

## Task 24: Final Cleanup and Documentation

**Files:**
- Modify: Various cleanup as needed

- [ ] **Step 1: Remove unused old features (if desired)**

Based on spec, these features should be removed:
- Prayer wall (`app/(main)/prayers/`)
- Memory verses (`app/(main)/memory/`)
- Reading plans (`app/(main)/plans/`)
- Achievements (`app/(main)/achievements/`)

Only remove if confirmed with user - they may want to keep them temporarily.

- [ ] **Step 2: Update any imports or references**

Check for broken imports after changes.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 1 learning platform foundation"
```

---

## Summary

This plan implements Phase 1 of the learning platform:

1. **Tasks 1-5**: Content infrastructure (types, storage, API routes, AI generation)
2. **Tasks 6-7**: Context providers (admin mode, progress tracking)
3. **Tasks 8-12**: Reader UI components and pages
4. **Tasks 13-18**: Admin UI components and pages
5. **Tasks 19-21**: Updated navigation and home page
6. **Task 22**: Scripture panel integration
7. **Tasks 23-24**: Testing and cleanup

Total: 24 tasks with bite-sized steps for TDD approach.
