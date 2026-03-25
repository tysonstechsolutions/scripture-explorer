# Scripture Explorer Phase 1 (MVP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Bible study platform with Bible reader, timeline explorer, AI chat, and donation system.

**Architecture:** Next.js App Router with Supabase backend. Bible text from API.Bible with aggressive caching. AI chat uses RAG with pgvector embeddings. Content generated on-demand by Claude and cached.

**Tech Stack:** Next.js 14+, React 18, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL + pgvector + Auth), Anthropic Claude API, OpenAI Embeddings API, API.Bible, Stripe

**Spec:** `docs/superpowers/specs/2026-03-25-scripture-explorer-design.md`

---

## File Structure

```
scripture-explorer/
├── app/
│   ├── layout.tsx                    # Root layout with providers, bottom nav
│   ├── page.tsx                      # Landing/home page
│   ├── globals.css                   # Tailwind + custom properties
│   ├── onboarding/
│   │   └── page.tsx                  # First-time text size setup
│   ├── read/
│   │   └── [book]/
│   │       └── [chapter]/
│   │           └── page.tsx          # Bible reader page
│   ├── timeline/
│   │   ├── page.tsx                  # Timeline overview (all eras)
│   │   └── [eraId]/
│   │       └── page.tsx              # Single era detail page
│   ├── ask/
│   │   └── page.tsx                  # AI chat interface
│   ├── profile/
│   │   └── page.tsx                  # Settings & preferences
│   ├── donate/
│   │   ├── page.tsx                  # Donation page
│   │   └── success/
│   │       └── page.tsx              # Post-donation thank you
│   └── api/
│       ├── bible/
│       │   └── route.ts              # Proxy to API.Bible
│       ├── content/
│       │   └── route.ts              # Generate/fetch cached content
│       ├── chat/
│       │   └── route.ts              # AI chat with RAG
│       ├── embeddings/
│       │   └── route.ts              # Generate embeddings
│       └── stripe/
│           ├── checkout/
│           │   └── route.ts          # Create checkout session
│           └── webhook/
│               └── route.ts          # Handle Stripe webhooks
├── components/
│   ├── ui/                           # shadcn/ui components (auto-generated)
│   ├── providers/
│   │   └── Providers.tsx             # All context providers wrapped
│   ├── layout/
│   │   ├── BottomNav.tsx             # Mobile navigation bar
│   │   ├── Breadcrumbs.tsx           # Location indicator
│   │   └── Header.tsx                # Top header with back button
│   ├── bible/
│   │   ├── VerseDisplay.tsx          # Renders verse with tap actions
│   │   ├── ChapterContent.tsx        # Full chapter display
│   │   └── BookChapterNav.tsx        # Navigation within Bible
│   ├── timeline/
│   │   ├── EraCard.tsx               # Summary card for an era
│   │   ├── EraDetail.tsx             # Full era content
│   │   └── TimelineList.tsx          # Scrollable era list
│   ├── chat/
│   │   ├── ChatInterface.tsx         # Full chat UI
│   │   ├── MessageBubble.tsx         # Single message display
│   │   └── SuggestedQuestions.tsx    # Context-aware suggestions
│   ├── shared/
│   │   ├── TextSizeSelector.tsx      # Accessibility text size control
│   │   ├── LoadingSpinner.tsx        # Loading state
│   │   └── ErrorBoundary.tsx         # Error handling
│   └── donate/
│       └── DonationForm.tsx          # Stripe checkout trigger
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server Supabase client
│   │   └── types.ts                  # Database types
│   ├── bible/
│   │   └── api.ts                    # API.Bible client
│   ├── ai/
│   │   ├── anthropic.ts              # Claude API client
│   │   ├── embeddings.ts             # OpenAI embeddings
│   │   ├── rag.ts                    # RAG retrieval logic
│   │   └── prompts.ts                # System prompts
│   ├── stripe/
│   │   └── client.ts                 # Stripe client
│   └── utils/
│       ├── references.ts             # Parse Bible references
│       └── constants.ts              # App constants
├── hooks/
│   ├── useTextSize.ts                # Text size preference hook
│   ├── useReadingPosition.ts         # Track reading position
│   └── useAutoBookmark.ts            # Auto-save position
├── contexts/
│   ├── PreferencesContext.tsx        # User preferences state
│   └── ReadingContext.tsx            # Current reading position
├── types/
│   └── index.ts                      # Shared TypeScript types
├── public/
│   ├── manifest.json                 # PWA manifest
│   └── icons/                        # App icons
├── .env.local.example                # Environment variable template
├── next.config.js                    # Next.js + PWA config
├── tailwind.config.ts                # Tailwind configuration
├── package.json
└── tsconfig.json
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `.env.local.example`
- Create: `.gitignore`

- [ ] **Step 1.1: Create Next.js project**

```bash
cd "C:/Users/tyson/Projects/scripture-explorer"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Expected: Project scaffolded with Next.js 14+

- [ ] **Step 1.2: Install core dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr @anthropic-ai/sdk openai stripe @stripe/stripe-js next-pwa
npm install -D @types/node
```

Expected: Dependencies added to package.json

- [ ] **Step 1.3: Install shadcn/ui**

```bash
npx shadcn@latest init -d
```

When prompted, select:
- Style: Default
- Base color: Neutral
- CSS variables: Yes

Expected: `components.json` created, `lib/utils.ts` created

- [ ] **Step 1.4: Add essential shadcn components**

```bash
npx shadcn@latest add button card input textarea dialog sheet toast slider
```

Expected: Components added to `components/ui/`

- [ ] **Step 1.5: Create environment template**

Create `.env.local.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# API.Bible
API_BIBLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# OpenAI (for embeddings)
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 1.6: Update .gitignore**

Append to `.gitignore`:

```
# Environment
.env.local
.env*.local

# Supabase
supabase/.temp

# PWA
public/sw.js
public/workbox-*.js
```

- [ ] **Step 1.7: Configure Tailwind with custom theme**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, scholarly palette
        parchment: {
          50: "#FDFBF7",
          100: "#F9F5ED",
          200: "#F5F0E6",
          300: "#EBE4D4",
          400: "#D9CEB8",
        },
        leather: {
          500: "#8B7355",
          600: "#6B5344",
          700: "#4A3728",
        },
        gold: {
          400: "#D4A853",
          500: "#C9993A",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Accessible text sizes with multiplier support
        "body-sm": ["calc(0.875rem * var(--text-multiplier, 1))", { lineHeight: "1.5" }],
        "body": ["calc(1rem * var(--text-multiplier, 1))", { lineHeight: "1.6" }],
        "body-lg": ["calc(1.125rem * var(--text-multiplier, 1))", { lineHeight: "1.6" }],
        "heading": ["calc(1.5rem * var(--text-multiplier, 1))", { lineHeight: "1.3" }],
      },
      minHeight: {
        "tap": "48px",
      },
      minWidth: {
        "tap": "48px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

- [ ] **Step 1.8: Update global CSS**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --text-multiplier: 1;
  --background: 30 25% 97%;
  --foreground: 30 10% 15%;
  --card: 30 20% 95%;
  --card-foreground: 30 10% 15%;
  --primary: 30 25% 44%;
  --primary-foreground: 30 25% 97%;
  --secondary: 40 50% 55%;
  --muted: 30 15% 85%;
  --muted-foreground: 30 10% 40%;
  --accent: 40 60% 50%;
  --border: 30 15% 80%;
  --radius: 0.5rem;
}

.dark {
  --text-multiplier: 1;
  --background: 220 20% 10%;
  --foreground: 30 15% 90%;
  --card: 220 15% 15%;
  --card-foreground: 30 15% 90%;
  --primary: 40 50% 55%;
  --primary-foreground: 220 20% 10%;
  --muted: 220 15% 20%;
  --muted-foreground: 30 10% 60%;
  --border: 220 15% 25%;
}

/* Text size multipliers */
[data-text-size="small"] { --text-multiplier: 0.875; }
[data-text-size="medium"] { --text-multiplier: 1; }
[data-text-size="large"] { --text-multiplier: 1.25; }
[data-text-size="xlarge"] { --text-multiplier: 1.5; }

/* Ensure minimum tap targets */
.tap-target {
  @apply min-h-tap min-w-tap flex items-center justify-center;
}

/* Bible text styling */
.verse-text {
  @apply font-serif text-body leading-relaxed;
}

.verse-number {
  @apply text-body-sm font-sans text-muted-foreground align-super mr-1;
}
```

- [ ] **Step 1.9: Create root layout**

Replace `app/layout.tsx`:

```typescript
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Scripture Explorer",
  description: "Explore the Bible from Genesis to modern day",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8B7355",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-parchment-100 text-foreground`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 1.10: Create placeholder home page**

Replace `app/page.tsx`:

```typescript
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-heading font-serif text-leather-700 mb-4">
          Scripture Explorer
        </h1>
        <p className="text-body text-muted-foreground">
          Coming soon...
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 1.11: Run dev server to verify**

```bash
npm run dev
```

Expected: App runs at http://localhost:3000, shows "Scripture Explorer - Coming soon..."

- [ ] **Step 1.12: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with Tailwind and shadcn/ui

- Next.js 14 with App Router
- Tailwind CSS with custom scholarly theme
- shadcn/ui components
- Accessibility-first CSS with text size multipliers
- Environment template"
```

---

## Task 2: Supabase Setup & Database Schema

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/types.ts`
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 2.1: Create Supabase project**

Go to https://supabase.com and create a new project named "scripture-explorer".
- Note the project URL and anon key
- Enable pgvector extension in SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

- [ ] **Step 2.2: Create browser Supabase client**

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2.3: Create server Supabase client**

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  );
}

export async function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}
```

- [ ] **Step 2.4: Create database types**

Create `lib/supabase/types.ts`:

```typescript
export type TextSize = "small" | "medium" | "large" | "xlarge";
export type Theme = "light" | "dark" | "high-contrast";
export type Lens = "historical" | "protestant" | "catholic" | "orthodox" | "jewish" | "islamic" | "secular";
export type ContentType = "era" | "event" | "figure" | "topic" | "lens_view";
export type BookmarkType = "verse" | "timeline" | "library";

export interface Profile {
  id: string;
  display_name: string | null;
  text_size_preference: TextSize;
  theme_preference: Theme;
  default_lens: Lens | null;
  created_at: string;
  updated_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse: number | null;
  translation: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  type: BookmarkType;
  reference: Record<string, unknown>;
  label: string | null;
  auto_saved: boolean;
  created_at: string;
}

export interface ContentCache {
  id: string;
  content_type: ContentType;
  content_key: string;
  content: Record<string, unknown>;
  generated_at: string;
  last_accessed_at: string;
  access_count: number;
  flagged_for_review: boolean;
}

export interface Embedding {
  id: string;
  content_type: string;
  content_key: string;
  chunk_index: number;
  text_content: string;
  embedding: number[];
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string | null;
  stripe_payment_id: string;
  amount_cents: number;
  currency: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      reading_progress: {
        Row: ReadingProgress;
        Insert: Omit<ReadingProgress, "id" | "updated_at">;
        Update: Partial<Omit<ReadingProgress, "id" | "user_id">>;
      };
      bookmarks: {
        Row: Bookmark;
        Insert: Omit<Bookmark, "id" | "created_at">;
        Update: Partial<Omit<Bookmark, "id" | "user_id">>;
      };
      content_cache: {
        Row: ContentCache;
        Insert: Omit<ContentCache, "id" | "generated_at" | "last_accessed_at" | "access_count">;
        Update: Partial<Omit<ContentCache, "id">>;
      };
      embeddings: {
        Row: Embedding;
        Insert: Omit<Embedding, "id" | "created_at">;
        Update: never;
      };
      donations: {
        Row: Donation;
        Insert: Omit<Donation, "id" | "created_at">;
        Update: never;
      };
    };
  };
}
```

- [ ] **Step 2.5: Create migration file**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  text_size_preference TEXT NOT NULL DEFAULT 'medium' CHECK (text_size_preference IN ('small', 'medium', 'large', 'xlarge')),
  theme_preference TEXT NOT NULL DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'high-contrast')),
  default_lens TEXT CHECK (default_lens IN ('historical', 'protestant', 'catholic', 'orthodox', 'jewish', 'islamic', 'secular')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reading progress
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER,
  translation TEXT NOT NULL DEFAULT 'kjv',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('verse', 'timeline', 'library')),
  reference JSONB NOT NULL,
  label TEXT,
  auto_saved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Content cache (shared across all users)
CREATE TABLE content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('era', 'event', 'figure', 'topic', 'lens_view')),
  content_key TEXT NOT NULL,
  content JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  access_count INTEGER NOT NULL DEFAULT 1,
  flagged_for_review BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(content_type, content_key)
);

-- Embeddings for RAG
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_key TEXT NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  text_content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(content_type, content_key, chunk_index)
);

-- Create index for vector similarity search
CREATE INDEX embeddings_embedding_idx ON embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_payment_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Reading progress: users can manage their own
CREATE POLICY "Users can manage own reading progress" ON reading_progress FOR ALL USING (auth.uid() = user_id);

-- Bookmarks: users can manage their own
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Content cache: anyone can read, only service role can write
CREATE POLICY "Anyone can read content cache" ON content_cache FOR SELECT USING (true);

-- Embeddings: anyone can read, only service role can write
CREATE POLICY "Anyone can read embeddings" ON embeddings FOR SELECT USING (true);

-- Donations: users can see their own
CREATE POLICY "Users can see own donations" ON donations FOR SELECT USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reading_progress_updated_at
  BEFORE UPDATE ON reading_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 2.6: Run migration in Supabase**

Go to Supabase Dashboard → SQL Editor → Run the migration SQL

Expected: All tables created successfully

- [ ] **Step 2.7: Copy Supabase credentials to .env.local**

Create `.env.local` from the template and fill in Supabase credentials.

- [ ] **Step 2.8: Commit**

```bash
git add .
git commit -m "feat: add Supabase client and database schema

- Browser and server Supabase clients
- TypeScript types for all tables
- Full database schema with RLS policies
- pgvector extension for RAG embeddings
- Auto-profile creation on signup"
```

---

## Task 3: Preferences Context & Text Size

**Files:**
- Create: `contexts/PreferencesContext.tsx`
- Create: `hooks/useTextSize.ts`
- Create: `components/shared/TextSizeSelector.tsx`
- Create: `components/providers/Providers.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 3.1: Create PreferencesContext**

Create `contexts/PreferencesContext.tsx`:

```typescript
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { TextSize, Theme, Lens } from "@/lib/supabase/types";

interface Preferences {
  textSize: TextSize;
  theme: Theme;
  defaultLens: Lens | null;
  hasCompletedOnboarding: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  setTextSize: (size: TextSize) => void;
  setTheme: (theme: Theme) => void;
  setDefaultLens: (lens: Lens | null) => void;
  completeOnboarding: () => void;
}

const defaultPreferences: Preferences = {
  textSize: "medium",
  theme: "light",
  defaultLens: null,
  hasCompletedOnboarding: false,
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

const STORAGE_KEY = "scripture-explorer-preferences";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch {
        // Invalid JSON, use defaults
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }
  }, [preferences, isLoaded]);

  // Apply text size to document
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute("data-text-size", preferences.textSize);
    }
  }, [preferences.textSize, isLoaded]);

  // Apply theme to document
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.remove("light", "dark");
      if (preferences.theme === "dark" || preferences.theme === "high-contrast") {
        document.documentElement.classList.add("dark");
      }
    }
  }, [preferences.theme, isLoaded]);

  const setTextSize = (textSize: TextSize) => {
    setPreferences((prev) => ({ ...prev, textSize }));
  };

  const setTheme = (theme: Theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const setDefaultLens = (defaultLens: Lens | null) => {
    setPreferences((prev) => ({ ...prev, defaultLens }));
  };

  const completeOnboarding = () => {
    setPreferences((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  };

  // Prevent flash of unstyled content
  if (!isLoaded) {
    return null;
  }

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setTextSize,
        setTheme,
        setDefaultLens,
        completeOnboarding,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
```

- [ ] **Step 3.2: Create useTextSize hook**

Create `hooks/useTextSize.ts`:

```typescript
"use client";

import { usePreferences } from "@/contexts/PreferencesContext";
import type { TextSize } from "@/lib/supabase/types";

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  xlarge: "Extra Large",
};

const TEXT_SIZE_VALUES: TextSize[] = ["small", "medium", "large", "xlarge"];

export function useTextSize() {
  const { preferences, setTextSize } = usePreferences();

  return {
    textSize: preferences.textSize,
    setTextSize,
    textSizeLabel: TEXT_SIZE_LABELS[preferences.textSize],
    textSizeOptions: TEXT_SIZE_VALUES.map((value) => ({
      value,
      label: TEXT_SIZE_LABELS[value],
    })),
  };
}
```

- [ ] **Step 3.3: Create TextSizeSelector component**

Create `components/shared/TextSizeSelector.tsx`:

```typescript
"use client";

import { useTextSize } from "@/hooks/useTextSize";
import { Button } from "@/components/ui/button";
import type { TextSize } from "@/lib/supabase/types";

interface TextSizeSelectorProps {
  showLabel?: boolean;
  className?: string;
}

export function TextSizeSelector({ showLabel = true, className = "" }: TextSizeSelectorProps) {
  const { textSize, setTextSize, textSizeOptions } = useTextSize();

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <label className="text-body font-medium">Text Size</label>
      )}
      <div className="flex gap-2 flex-wrap">
        {textSizeOptions.map((option) => (
          <Button
            key={option.value}
            variant={textSize === option.value ? "default" : "outline"}
            className="min-h-tap min-w-tap"
            onClick={() => setTextSize(option.value as TextSize)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <p
        className="text-body text-muted-foreground mt-4 p-4 bg-card rounded-lg"
        style={{ fontSize: `calc(1rem * var(--text-multiplier, 1))` }}
      >
        Preview: This is how your text will appear throughout the app.
      </p>
    </div>
  );
}
```

- [ ] **Step 3.4: Create Providers wrapper**

Create `components/providers/Providers.tsx`:

```typescript
"use client";

import { ReactNode } from "react";
import { PreferencesProvider } from "@/contexts/PreferencesContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      {children}
    </PreferencesProvider>
  );
}
```

- [ ] **Step 3.5: Update layout to use Providers**

Replace `app/layout.tsx`:

```typescript
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Scripture Explorer",
  description: "Explore the Bible from Genesis to modern day",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8B7355",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-parchment-100 text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 3.6: Run dev server to verify**

```bash
npm run dev
```

Expected: App loads without errors (context is working)

- [ ] **Step 3.7: Commit**

```bash
git add .
git commit -m "feat: add preferences context with text size accessibility

- PreferencesContext for global state
- Text size selector with live preview
- Persists to localStorage
- Applies CSS custom property for scaling"
```

---

## Task 4: Onboarding Flow

**Files:**
- Create: `app/onboarding/page.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 4.1: Create onboarding page**

Create `app/onboarding/page.tsx`:

```typescript
"use client";

import { useRouter } from "next/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";
import { TextSizeSelector } from "@/components/shared/TextSizeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = usePreferences();

  const handleContinue = () => {
    completeOnboarding();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-parchment-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-heading font-serif text-leather-700">
            Welcome to Scripture Explorer
          </CardTitle>
          <CardDescription className="text-body">
            Let&apos;s set up your reading experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextSizeSelector />

          <div className="pt-4">
            <Button
              onClick={handleContinue}
              className="w-full min-h-tap text-body"
              size="lg"
            >
              Continue
            </Button>
          </div>

          <p className="text-body-sm text-center text-muted-foreground">
            You can change this anytime in Settings
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 4.2: Update home page with onboarding redirect**

Replace `app/page.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function HomePage() {
  const router = useRouter();
  const { preferences } = usePreferences();

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [preferences.hasCompletedOnboarding, router]);

  // Show loading while checking onboarding status
  if (!preferences.hasCompletedOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-body text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-heading font-serif text-leather-700 mb-4">
          Scripture Explorer
        </h1>
        <p className="text-body text-muted-foreground">
          Welcome! The app is being built...
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 4.3: Test onboarding flow**

```bash
npm run dev
```

1. Clear localStorage (DevTools → Application → Local Storage → Clear)
2. Refresh page
3. Expected: Redirects to /onboarding
4. Select text size, click Continue
5. Expected: Returns to home, shows welcome message
6. Refresh page
7. Expected: Stays on home (onboarding complete)

- [ ] **Step 4.4: Commit**

```bash
git add .
git commit -m "feat: add onboarding flow for text size setup

- First-time user redirected to /onboarding
- Text size selection with live preview
- Persists completion state to localStorage"
```

---

## Task 5: Bottom Navigation & Layout Shell

**Files:**
- Create: `components/layout/BottomNav.tsx`
- Create: `components/layout/Header.tsx`
- Create: `components/layout/AppShell.tsx`
- Create: `app/(main)/layout.tsx`
- Move home to: `app/(main)/page.tsx`

- [ ] **Step 5.1: Create BottomNav component**

Create `components/layout/BottomNav.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, Library, MessageCircle, User } from "lucide-react";

const navItems = [
  { href: "/read", label: "Read", icon: BookOpen },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/library", label: "Library", icon: Library },
  { href: "/ask", label: "Ask", icon: MessageCircle },
  { href: "/profile", label: "Me", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-tap min-w-tap px-3 py-2 transition-colors ${
                isActive
                  ? "text-leather-600 dark:text-gold-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 5.2: Create Header component**

Create `components/layout/Header.tsx`:

```typescript
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-parchment-100/95 dark:bg-gray-900/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className="min-h-tap min-w-tap"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          <h1 className="text-lg font-serif font-semibold text-leather-700 dark:text-parchment-100 truncate">
            {title}
          </h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
```

- [ ] **Step 5.3: Create AppShell component**

Create `components/layout/AppShell.tsx`:

```typescript
import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 5.4: Create main route group layout**

Create `app/(main)/layout.tsx`:

```typescript
import { AppShell } from "@/components/layout/AppShell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
```

- [ ] **Step 5.5: Move home page to route group**

Move `app/page.tsx` to `app/(main)/page.tsx` (same content, just new location).

Then update the redirect logic:

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  const router = useRouter();
  const { preferences } = usePreferences();

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [preferences.hasCompletedOnboarding, router]);

  if (!preferences.hasCompletedOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-body text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <>
      <Header title="Scripture Explorer" />
      <main className="p-4">
        <div className="text-center py-12">
          <h2 className="text-heading font-serif text-leather-700 mb-4">
            Welcome!
          </h2>
          <p className="text-body text-muted-foreground max-w-md mx-auto">
            Explore the Bible from Genesis to modern day. Use the navigation below to get started.
          </p>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 5.6: Install lucide-react**

```bash
npm install lucide-react
```

- [ ] **Step 5.7: Add safe area CSS**

Add to `app/globals.css`:

```css
/* Safe area for mobile devices */
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
```

- [ ] **Step 5.8: Run dev server to verify**

```bash
npm run dev
```

Expected:
- Bottom navigation visible with 5 items
- Header shows "Scripture Explorer"
- Tapping nav items changes URL (pages don't exist yet)

- [ ] **Step 5.9: Commit**

```bash
git add .
git commit -m "feat: add app shell with bottom navigation

- BottomNav with 5 sections
- Header component with optional back button
- AppShell wrapper with safe areas
- Route group for main app layout"
```

---

## Task 6: Placeholder Pages for Navigation

**Files:**
- Create: `app/(main)/read/page.tsx`
- Create: `app/(main)/timeline/page.tsx`
- Create: `app/(main)/library/page.tsx`
- Create: `app/(main)/ask/page.tsx`
- Create: `app/(main)/profile/page.tsx`

- [ ] **Step 6.1: Create Read placeholder**

Create `app/(main)/read/page.tsx`:

```typescript
import { Header } from "@/components/layout/Header";

export default function ReadPage() {
  return (
    <>
      <Header title="Read" />
      <main className="p-4">
        <p className="text-body text-muted-foreground">
          Bible reader coming soon...
        </p>
      </main>
    </>
  );
}
```

- [ ] **Step 6.2: Create Timeline placeholder**

Create `app/(main)/timeline/page.tsx`:

```typescript
import { Header } from "@/components/layout/Header";

export default function TimelinePage() {
  return (
    <>
      <Header title="Timeline" />
      <main className="p-4">
        <p className="text-body text-muted-foreground">
          Timeline explorer coming soon...
        </p>
      </main>
    </>
  );
}
```

- [ ] **Step 6.3: Create Library placeholder**

Create `app/(main)/library/page.tsx`:

```typescript
import { Header } from "@/components/layout/Header";

export default function LibraryPage() {
  return (
    <>
      <Header title="Library" />
      <main className="p-4">
        <p className="text-body text-muted-foreground">
          Topic library coming soon...
        </p>
      </main>
    </>
  );
}
```

- [ ] **Step 6.4: Create Ask placeholder**

Create `app/(main)/ask/page.tsx`:

```typescript
import { Header } from "@/components/layout/Header";

export default function AskPage() {
  return (
    <>
      <Header title="Ask AI" />
      <main className="p-4">
        <p className="text-body text-muted-foreground">
          AI assistant coming soon...
        </p>
      </main>
    </>
  );
}
```

- [ ] **Step 6.5: Create Profile placeholder**

Create `app/(main)/profile/page.tsx`:

```typescript
"use client";

import { Header } from "@/components/layout/Header";
import { TextSizeSelector } from "@/components/shared/TextSizeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <>
      <Header title="Settings" />
      <main className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-body font-semibold">Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <TextSizeSelector />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
```

- [ ] **Step 6.6: Test all navigation**

```bash
npm run dev
```

Click through all 5 nav items. Each should show its placeholder page.

- [ ] **Step 6.7: Commit**

```bash
git add .
git commit -m "feat: add placeholder pages for all navigation sections

- Read, Timeline, Library, Ask, Profile pages
- Profile includes text size settings
- All pages use consistent Header component"
```

---

## Task 7: API.Bible Integration

**Files:**
- Create: `lib/bible/api.ts`
- Create: `lib/bible/types.ts`
- Create: `lib/bible/books.ts`
- Create: `app/api/bible/route.ts`

- [ ] **Step 7.1: Create Bible types**

Create `lib/bible/types.ts`:

```typescript
export interface BibleBook {
  id: string;
  name: string;
  nameLong: string;
  abbreviation: string;
  chapters: number;
}

export interface BibleVerse {
  id: string;
  orgId: string;
  bookId: string;
  chapterId: string;
  reference: string;
  text: string;
}

export interface BibleChapter {
  id: string;
  bookId: string;
  number: string;
  reference: string;
  content: string;
  verseCount: number;
}

export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

// API.Bible response types
export interface ApiBibleResponse<T> {
  data: T;
  meta?: {
    fums: string;
    fumsId: string;
    fumsJsInclude: string;
    fumsJs: string;
    fumsNoScript: string;
  };
}
```

- [ ] **Step 7.2: Create books data**

Create `lib/bible/books.ts`:

```typescript
import type { BibleBook } from "./types";

// KJV book IDs from API.Bible
export const BIBLE_BOOKS: BibleBook[] = [
  { id: "GEN", name: "Genesis", nameLong: "The First Book of Moses, called Genesis", abbreviation: "Gen", chapters: 50 },
  { id: "EXO", name: "Exodus", nameLong: "The Second Book of Moses, called Exodus", abbreviation: "Exod", chapters: 40 },
  { id: "LEV", name: "Leviticus", nameLong: "The Third Book of Moses, called Leviticus", abbreviation: "Lev", chapters: 27 },
  { id: "NUM", name: "Numbers", nameLong: "The Fourth Book of Moses, called Numbers", abbreviation: "Num", chapters: 36 },
  { id: "DEU", name: "Deuteronomy", nameLong: "The Fifth Book of Moses, called Deuteronomy", abbreviation: "Deut", chapters: 34 },
  { id: "JOS", name: "Joshua", nameLong: "The Book of Joshua", abbreviation: "Josh", chapters: 24 },
  { id: "JDG", name: "Judges", nameLong: "The Book of Judges", abbreviation: "Judg", chapters: 21 },
  { id: "RUT", name: "Ruth", nameLong: "The Book of Ruth", abbreviation: "Ruth", chapters: 4 },
  { id: "1SA", name: "1 Samuel", nameLong: "The First Book of Samuel", abbreviation: "1 Sam", chapters: 31 },
  { id: "2SA", name: "2 Samuel", nameLong: "The Second Book of Samuel", abbreviation: "2 Sam", chapters: 24 },
  { id: "1KI", name: "1 Kings", nameLong: "The First Book of the Kings", abbreviation: "1 Kgs", chapters: 22 },
  { id: "2KI", name: "2 Kings", nameLong: "The Second Book of the Kings", abbreviation: "2 Kgs", chapters: 25 },
  { id: "1CH", name: "1 Chronicles", nameLong: "The First Book of the Chronicles", abbreviation: "1 Chr", chapters: 29 },
  { id: "2CH", name: "2 Chronicles", nameLong: "The Second Book of the Chronicles", abbreviation: "2 Chr", chapters: 36 },
  { id: "EZR", name: "Ezra", nameLong: "The Book of Ezra", abbreviation: "Ezra", chapters: 10 },
  { id: "NEH", name: "Nehemiah", nameLong: "The Book of Nehemiah", abbreviation: "Neh", chapters: 13 },
  { id: "EST", name: "Esther", nameLong: "The Book of Esther", abbreviation: "Esth", chapters: 10 },
  { id: "JOB", name: "Job", nameLong: "The Book of Job", abbreviation: "Job", chapters: 42 },
  { id: "PSA", name: "Psalms", nameLong: "The Book of Psalms", abbreviation: "Ps", chapters: 150 },
  { id: "PRO", name: "Proverbs", nameLong: "The Proverbs", abbreviation: "Prov", chapters: 31 },
  { id: "ECC", name: "Ecclesiastes", nameLong: "Ecclesiastes or, the Preacher", abbreviation: "Eccl", chapters: 12 },
  { id: "SNG", name: "Song of Solomon", nameLong: "The Song of Solomon", abbreviation: "Song", chapters: 8 },
  { id: "ISA", name: "Isaiah", nameLong: "The Book of the Prophet Isaiah", abbreviation: "Isa", chapters: 66 },
  { id: "JER", name: "Jeremiah", nameLong: "The Book of the Prophet Jeremiah", abbreviation: "Jer", chapters: 52 },
  { id: "LAM", name: "Lamentations", nameLong: "The Lamentations of Jeremiah", abbreviation: "Lam", chapters: 5 },
  { id: "EZK", name: "Ezekiel", nameLong: "The Book of the Prophet Ezekiel", abbreviation: "Ezek", chapters: 48 },
  { id: "DAN", name: "Daniel", nameLong: "The Book of Daniel", abbreviation: "Dan", chapters: 12 },
  { id: "HOS", name: "Hosea", nameLong: "Hosea", abbreviation: "Hos", chapters: 14 },
  { id: "JOL", name: "Joel", nameLong: "Joel", abbreviation: "Joel", chapters: 3 },
  { id: "AMO", name: "Amos", nameLong: "Amos", abbreviation: "Amos", chapters: 9 },
  { id: "OBA", name: "Obadiah", nameLong: "Obadiah", abbreviation: "Obad", chapters: 1 },
  { id: "JON", name: "Jonah", nameLong: "Jonah", abbreviation: "Jonah", chapters: 4 },
  { id: "MIC", name: "Micah", nameLong: "Micah", abbreviation: "Mic", chapters: 7 },
  { id: "NAM", name: "Nahum", nameLong: "Nahum", abbreviation: "Nah", chapters: 3 },
  { id: "HAB", name: "Habakkuk", nameLong: "Habakkuk", abbreviation: "Hab", chapters: 3 },
  { id: "ZEP", name: "Zephaniah", nameLong: "Zephaniah", abbreviation: "Zeph", chapters: 3 },
  { id: "HAG", name: "Haggai", nameLong: "Haggai", abbreviation: "Hag", chapters: 2 },
  { id: "ZEC", name: "Zechariah", nameLong: "Zechariah", abbreviation: "Zech", chapters: 14 },
  { id: "MAL", name: "Malachi", nameLong: "Malachi", abbreviation: "Mal", chapters: 4 },
  { id: "MAT", name: "Matthew", nameLong: "The Gospel According to Matthew", abbreviation: "Matt", chapters: 28 },
  { id: "MRK", name: "Mark", nameLong: "The Gospel According to Mark", abbreviation: "Mark", chapters: 16 },
  { id: "LUK", name: "Luke", nameLong: "The Gospel According to Luke", abbreviation: "Luke", chapters: 24 },
  { id: "JHN", name: "John", nameLong: "The Gospel According to John", abbreviation: "John", chapters: 21 },
  { id: "ACT", name: "Acts", nameLong: "The Acts of the Apostles", abbreviation: "Acts", chapters: 28 },
  { id: "ROM", name: "Romans", nameLong: "The Epistle of Paul the Apostle to the Romans", abbreviation: "Rom", chapters: 16 },
  { id: "1CO", name: "1 Corinthians", nameLong: "The First Epistle of Paul the Apostle to the Corinthians", abbreviation: "1 Cor", chapters: 16 },
  { id: "2CO", name: "2 Corinthians", nameLong: "The Second Epistle of Paul the Apostle to the Corinthians", abbreviation: "2 Cor", chapters: 13 },
  { id: "GAL", name: "Galatians", nameLong: "The Epistle of Paul the Apostle to the Galatians", abbreviation: "Gal", chapters: 6 },
  { id: "EPH", name: "Ephesians", nameLong: "The Epistle of Paul the Apostle to the Ephesians", abbreviation: "Eph", chapters: 6 },
  { id: "PHP", name: "Philippians", nameLong: "The Epistle of Paul the Apostle to the Philippians", abbreviation: "Phil", chapters: 4 },
  { id: "COL", name: "Colossians", nameLong: "The Epistle of Paul the Apostle to the Colossians", abbreviation: "Col", chapters: 4 },
  { id: "1TH", name: "1 Thessalonians", nameLong: "The First Epistle of Paul the Apostle to the Thessalonians", abbreviation: "1 Thess", chapters: 5 },
  { id: "2TH", name: "2 Thessalonians", nameLong: "The Second Epistle of Paul the Apostle to the Thessalonians", abbreviation: "2 Thess", chapters: 3 },
  { id: "1TI", name: "1 Timothy", nameLong: "The First Epistle of Paul the Apostle to Timothy", abbreviation: "1 Tim", chapters: 6 },
  { id: "2TI", name: "2 Timothy", nameLong: "The Second Epistle of Paul the Apostle to Timothy", abbreviation: "2 Tim", chapters: 4 },
  { id: "TIT", name: "Titus", nameLong: "The Epistle of Paul the Apostle to Titus", abbreviation: "Titus", chapters: 3 },
  { id: "PHM", name: "Philemon", nameLong: "The Epistle of Paul the Apostle to Philemon", abbreviation: "Phlm", chapters: 1 },
  { id: "HEB", name: "Hebrews", nameLong: "The Epistle of Paul the Apostle to the Hebrews", abbreviation: "Heb", chapters: 13 },
  { id: "JAS", name: "James", nameLong: "The General Epistle of James", abbreviation: "Jas", chapters: 5 },
  { id: "1PE", name: "1 Peter", nameLong: "The First Epistle General of Peter", abbreviation: "1 Pet", chapters: 5 },
  { id: "2PE", name: "2 Peter", nameLong: "The Second Epistle General of Peter", abbreviation: "2 Pet", chapters: 3 },
  { id: "1JN", name: "1 John", nameLong: "The First Epistle General of John", abbreviation: "1 John", chapters: 5 },
  { id: "2JN", name: "2 John", nameLong: "The Second Epistle of John", abbreviation: "2 John", chapters: 1 },
  { id: "3JN", name: "3 John", nameLong: "The Third Epistle of John", abbreviation: "3 John", chapters: 1 },
  { id: "JUD", name: "Jude", nameLong: "The General Epistle of Jude", abbreviation: "Jude", chapters: 1 },
  { id: "REV", name: "Revelation", nameLong: "The Revelation of Jesus Christ", abbreviation: "Rev", chapters: 22 },
];

export function getBookBySlug(slug: string): BibleBook | undefined {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return BIBLE_BOOKS.find(
    (book) =>
      book.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized ||
      book.abbreviation.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized ||
      book.id.toLowerCase() === normalized
  );
}

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((book) => book.id === id);
}
```

- [ ] **Step 7.3: Create Bible API client**

Create `lib/bible/api.ts`:

```typescript
import type { ApiBibleResponse, BibleChapter } from "./types";

const API_BASE = "https://api.scripture.api.bible/v1";

// KJV Bible ID from API.Bible
const KJV_BIBLE_ID = "de4e12af7f28f599-02";

interface FetchChapterOptions {
  bookId: string;
  chapter: number;
}

export async function fetchChapter({ bookId, chapter }: FetchChapterOptions): Promise<BibleChapter> {
  const chapterId = `${bookId}.${chapter}`;

  const response = await fetch(
    `${API_BASE}/bibles/${KJV_BIBLE_ID}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
    {
      headers: {
        "api-key": process.env.API_BIBLE_KEY!,
      },
      next: {
        revalidate: 60 * 60 * 24 * 30, // Cache for 30 days
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API.Bible error: ${response.status} ${response.statusText}`);
  }

  const json: ApiBibleResponse<{
    id: string;
    bibleId: string;
    bookId: string;
    number: string;
    reference: string;
    content: string;
    verseCount: number;
  }> = await response.json();

  return {
    id: json.data.id,
    bookId: json.data.bookId,
    number: json.data.number,
    reference: json.data.reference,
    content: json.data.content,
    verseCount: json.data.verseCount,
  };
}
```

- [ ] **Step 7.4: Create Bible API route**

Create `app/api/bible/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { fetchChapter } from "@/lib/bible/api";
import { getBookBySlug } from "@/lib/bible/books";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");

  if (!book || !chapter) {
    return NextResponse.json(
      { error: "Missing book or chapter parameter" },
      { status: 400 }
    );
  }

  const bookData = getBookBySlug(book);
  if (!bookData) {
    return NextResponse.json(
      { error: `Unknown book: ${book}` },
      { status: 404 }
    );
  }

  const chapterNum = parseInt(chapter, 10);
  if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > bookData.chapters) {
    return NextResponse.json(
      { error: `Invalid chapter: ${chapter}. ${bookData.name} has ${bookData.chapters} chapters.` },
      { status: 400 }
    );
  }

  try {
    const data = await fetchChapter({
      bookId: bookData.id,
      chapter: chapterNum,
    });

    return NextResponse.json({
      book: bookData,
      chapter: data,
    });
  } catch (error) {
    console.error("Bible API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapter" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 7.5: Add API_BIBLE_KEY to .env.local**

Get your free API key from https://scripture.api.bible and add to `.env.local`:

```
API_BIBLE_KEY=your-api-key-here
```

- [ ] **Step 7.6: Test the API route**

```bash
npm run dev
```

Visit: http://localhost:3000/api/bible?book=john&chapter=3

Expected: JSON response with John chapter 3 content

- [ ] **Step 7.7: Commit**

```bash
git add .
git commit -m "feat: add API.Bible integration

- Bible API client with chapter fetching
- Full book list with metadata
- API route proxying to API.Bible
- 30-day cache for Bible content"
```

---

## Task 8: Bible Reader UI

**Files:**
- Create: `components/bible/ChapterContent.tsx`
- Create: `components/bible/BookChapterNav.tsx`
- Create: `app/(main)/read/page.tsx` (update)
- Create: `app/(main)/read/[book]/[chapter]/page.tsx`

- [ ] **Step 8.1: Create ChapterContent component**

Create `components/bible/ChapterContent.tsx`:

```typescript
"use client";

interface ChapterContentProps {
  content: string;
  reference: string;
}

export function ChapterContent({ content, reference }: ChapterContentProps) {
  // Parse the plain text content into verses
  // API.Bible returns text with verse numbers like "[1] In the beginning..."
  const lines = content.split("\n").filter((line) => line.trim());

  return (
    <article className="prose prose-lg max-w-none">
      <div className="text-body-sm text-muted-foreground mb-4">{reference}</div>
      <div className="verse-text space-y-4">
        {lines.map((line, index) => {
          // Extract verse number if present
          const verseMatch = line.match(/^\[(\d+)\]\s*/);
          const verseNum = verseMatch ? verseMatch[1] : null;
          const text = verseMatch ? line.replace(/^\[\d+\]\s*/, "") : line;

          return (
            <p key={index} className="text-body leading-relaxed">
              {verseNum && (
                <sup className="verse-number text-leather-500 font-sans mr-1">
                  {verseNum}
                </sup>
              )}
              {text}
            </p>
          );
        })}
      </div>
    </article>
  );
}
```

- [ ] **Step 8.2: Create BookChapterNav component**

Create `components/bible/BookChapterNav.tsx`:

```typescript
"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BibleBook } from "@/lib/bible/types";
import { BIBLE_BOOKS, getBookById } from "@/lib/bible/books";

interface BookChapterNavProps {
  currentBook: BibleBook;
  currentChapter: number;
}

export function BookChapterNav({ currentBook, currentChapter }: BookChapterNavProps) {
  // Calculate prev/next
  let prevHref: string | null = null;
  let nextHref: string | null = null;

  if (currentChapter > 1) {
    prevHref = `/read/${currentBook.name.toLowerCase().replace(/\s+/g, "-")}/${currentChapter - 1}`;
  } else {
    // Go to previous book's last chapter
    const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id);
    if (bookIndex > 0) {
      const prevBook = BIBLE_BOOKS[bookIndex - 1];
      prevHref = `/read/${prevBook.name.toLowerCase().replace(/\s+/g, "-")}/${prevBook.chapters}`;
    }
  }

  if (currentChapter < currentBook.chapters) {
    nextHref = `/read/${currentBook.name.toLowerCase().replace(/\s+/g, "-")}/${currentChapter + 1}`;
  } else {
    // Go to next book's first chapter
    const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id);
    if (bookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[bookIndex + 1];
      nextHref = `/read/${nextBook.name.toLowerCase().replace(/\s+/g, "-")}/1`;
    }
  }

  return (
    <div className="flex items-center justify-between py-4 border-t border-border mt-8">
      {prevHref ? (
        <Link href={prevHref}>
          <Button variant="ghost" className="min-h-tap">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </Button>
        </Link>
      ) : (
        <div />
      )}

      <span className="text-body-sm text-muted-foreground">
        {currentBook.name} {currentChapter}
      </span>

      {nextHref ? (
        <Link href={nextHref}>
          <Button variant="ghost" className="min-h-tap">
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
```

- [ ] **Step 8.3: Create chapter page**

Create `app/(main)/read/[book]/[chapter]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ChapterContent } from "@/components/bible/ChapterContent";
import { BookChapterNav } from "@/components/bible/BookChapterNav";
import { getBookBySlug } from "@/lib/bible/books";
import { fetchChapter } from "@/lib/bible/api";

interface PageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export default async function ChapterPage({ params }: PageProps) {
  const { book: bookSlug, chapter: chapterStr } = await params;

  const book = getBookBySlug(bookSlug);
  if (!book) {
    notFound();
  }

  const chapter = parseInt(chapterStr, 10);
  if (isNaN(chapter) || chapter < 1 || chapter > book.chapters) {
    notFound();
  }

  const chapterData = await fetchChapter({
    bookId: book.id,
    chapter,
  });

  return (
    <>
      <Header title={`${book.name} ${chapter}`} showBack />
      <main className="p-4 max-w-2xl mx-auto">
        <ChapterContent
          content={chapterData.content}
          reference={chapterData.reference}
        />
        <BookChapterNav currentBook={book} currentChapter={chapter} />
      </main>
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { book: bookSlug, chapter } = await params;
  const book = getBookBySlug(bookSlug);

  return {
    title: book ? `${book.name} ${chapter} - Scripture Explorer` : "Scripture Explorer",
  };
}
```

- [ ] **Step 8.4: Update Read landing page**

Replace `app/(main)/read/page.tsx`:

```typescript
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BIBLE_BOOKS } from "@/lib/bible/books";

export default function ReadPage() {
  const oldTestament = BIBLE_BOOKS.slice(0, 39);
  const newTestament = BIBLE_BOOKS.slice(39);

  return (
    <>
      <Header title="Read" />
      <main className="p-4 pb-24">
        <section className="mb-8">
          <h2 className="text-body font-semibold mb-4">Old Testament</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {oldTestament.map((book) => (
              <Link
                key={book.id}
                href={`/read/${book.name.toLowerCase().replace(/\s+/g, "-")}/1`}
                className="tap-target"
              >
                <Card className="hover:bg-parchment-200 transition-colors h-full">
                  <CardContent className="p-3">
                    <div className="text-body-sm font-medium truncate">{book.name}</div>
                    <div className="text-xs text-muted-foreground">{book.chapters} ch</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-body font-semibold mb-4">New Testament</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {newTestament.map((book) => (
              <Link
                key={book.id}
                href={`/read/${book.name.toLowerCase().replace(/\s+/g, "-")}/1`}
                className="tap-target"
              >
                <Card className="hover:bg-parchment-200 transition-colors h-full">
                  <CardContent className="p-3">
                    <div className="text-body-sm font-medium truncate">{book.name}</div>
                    <div className="text-xs text-muted-foreground">{book.chapters} ch</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
```

- [ ] **Step 8.5: Test Bible reader**

```bash
npm run dev
```

1. Go to http://localhost:3000/read
2. Expected: Grid of all Bible books
3. Click "John"
4. Expected: John chapter 1 with verse numbers
5. Click "Next"
6. Expected: John chapter 2
7. Test previous/next navigation between books

- [ ] **Step 8.6: Commit**

```bash
git add .
git commit -m "feat: add Bible reader with chapter navigation

- Book selection grid with OT/NT sections
- Chapter display with verse numbers
- Previous/next navigation between chapters
- Seamless book transitions"
```

---

## Task 9: Continue with remaining features...

The plan continues with:
- Task 9: Timeline data structure and UI
- Task 10: AI content generation API
- Task 11: AI chat with RAG
- Task 12: Donation page with Stripe
- Task 13: PWA configuration
- Task 14: Deployment to Vercel

Due to the length of this plan, I'll pause here. Each subsequent task follows the same pattern:
- Specific files to create/modify
- Step-by-step implementation
- Code provided in full
- Test instructions
- Commit at each task boundary

---

## Remaining Tasks (Summary)

### Task 9: Timeline Data & UI
- Define 14 eras with metadata
- EraCard and TimelineList components
- Timeline overview and detail pages
- Content generation trigger on first view

### Task 10: AI Content Generation
- Anthropic client setup
- Content generation prompts
- Caching in Supabase
- API route for generating/fetching content

### Task 11: AI Chat with RAG
- OpenAI embeddings client
- pgvector similarity search
- Chat API route with streaming
- ChatInterface component
- Context-aware suggestions

### Task 12: Stripe Donations
- Stripe client setup
- Checkout session creation
- Webhook handling
- DonationForm and success page

### Task 13: PWA Configuration
- next-pwa setup
- Manifest and icons
- Service worker configuration
- Offline fallback page

### Task 14: Deployment
- Vercel project setup
- Environment variables
- Domain configuration
- Production testing

---

**To continue:** Request Tasks 9-14 to be written out in the same detail, or begin implementation of Tasks 1-8 first.
