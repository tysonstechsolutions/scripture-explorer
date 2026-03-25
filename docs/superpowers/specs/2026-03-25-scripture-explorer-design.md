# Scripture Explorer - System Design Specification

**Product Name:** Scripture Explorer (working title)
**Author:** Tyson Bruce — Tyson's Tech Solutions
**Date:** 2026-03-25
**Status:** Approved for Implementation

---

## Executive Summary

Scripture Explorer is a comprehensive, interactive Bible study platform functioning as a complete library of Christianity — from Genesis to modern day. It provides in-depth, academically honest, multi-lens exploration letting users read actual Bible text, explore history, understand how the Bible was assembled, compare religious interpretations, take notes, and ask AI questions.

### Core Principles
- **Accessibility First:** Configurable text sizes, high contrast mode, 48px minimum tap targets
- **ADHD-Friendly Navigation:** Breadcrumbs, auto-bookmarks, no dead ends, progress tracking
- **Non-Biased, Multi-Perspective:** Present all viewpoints without declaring winners

### Target Users
- Complete beginners exploring Christianity for the first time
- People of any faith (or none) seeking intellectual engagement
- Content creators (TikTok, YouTube) documenting their Bible study journey
- Elderly users with vision accessibility needs
- Users with ADHD who need clear navigation

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Full architecture design, phased implementation | Prevents costly rewrites when adding features |
| Bible Data | API.Bible (external API) with caching | Access to multiple translations |
| Backend | Supabase (PostgreSQL, auth, real-time) | Relational model fits cross-referencing, SQL flexibility |
| Frontend | Next.js App Router | SSR for SEO, built-in API routes for key hiding |
| AI Architecture | RAG with pgvector | Grounded answers from curated content |
| Content Strategy | Fully dynamic AI generation with caching | No manual writing required |
| Donations | Stripe only | Clean, professional, handles cards and Apple/Google Pay |
| Project Location | `C:\Users\tyson\Projects\scripture-explorer` | Dedicated projects folder |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │  Reader  │ │ Timeline │ │ Library  │ │ AI Chat  │ │Profile ││
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘│
│       └────────────┴────────────┴────────────┴───────────┘     │
│                              │                                  │
│                    React Context (Global State)                 │
│         • Current position  • User preferences  • Auth         │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Next.js API      │
                    │  Routes (/api)    │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   API.Bible   │    │   Supabase    │    │   Anthropic   │
│  (Bible text) │    │  (Data/Auth)  │    │   (Claude)    │
└───────────────┘    └───────┬───────┘    └───────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────────┐
        │  Users   │  │ Content  │  │   pgvector   │
        │  Notes   │  │  Cache   │  │  Embeddings  │
        │ Progress │  │          │  │   (RAG)      │
        └──────────┘  └──────────┘  └──────────────┘
```

### Key Data Flows

1. **Bible reading:** Client → API route → API.Bible → cached in Supabase → returned
2. **AI questions:** Client → API route → fetch relevant embeddings from pgvector → Anthropic with context → response streamed back
3. **Content (timeline/library):** Client requests topic → check cache → if miss, generate with AI → cache → return
4. **User data:** Direct Supabase client connection with row-level security

---

## Database Schema

### Users & Auth

```sql
profiles
├── id (uuid, FK to auth.users)
├── display_name (text)
├── text_size_preference (enum: small/medium/large/xlarge)
├── theme_preference (enum: light/dark/high-contrast)
├── default_lens (enum: historical/protestant/catholic/orthodox/jewish/islamic/secular)
├── created_at, updated_at
```

### Bible Reading

```sql
reading_progress
├── id (uuid)
├── user_id (FK profiles)
├── book, chapter, verse (current position)
├── translation (text)
├── updated_at

bookmarks
├── id (uuid)
├── user_id (FK profiles)
├── type (enum: verse/timeline/library)
├── reference (jsonb)
├── label (text, optional)
├── auto_saved (boolean)
├── created_at

highlights
├── id (uuid)
├── user_id (FK profiles)
├── book, chapter, verse_start, verse_end
├── color (text)
├── created_at
```

### Notes

```sql
notes
├── id (uuid)
├── user_id (FK profiles)
├── type (enum: verse/timeline/library/freeform)
├── reference (jsonb, nullable)
├── title (text, nullable)
├── content (text)
├── tags (text[])
├── created_at, updated_at
```

### Content Cache

```sql
content_cache
├── id (uuid)
├── content_type (enum: era/event/figure/book/topic/lens_view)
├── content_key (text)
├── content (jsonb)
├── generated_at
├── last_accessed_at
├── access_count (int)
├── flagged_for_review (boolean)
```

### RAG Embeddings

```sql
embeddings
├── id (uuid)
├── content_type (text)
├── content_key (text)
├── chunk_index (int)
├── text_content (text)
├── embedding (vector(1536))
├── created_at
```

### Donations

```sql
donations
├── id (uuid)
├── user_id (FK profiles, nullable)
├── stripe_payment_id (text)
├── amount_cents (int)
├── currency (text)
├── created_at
```

### Reading Stats

```sql
reading_sessions
├── id (uuid)
├── user_id (FK profiles)
├── started_at, ended_at
├── verses_read (int)
├── topics_explored (int)
```

---

## Content Structure

### Timeline (14 Eras)

1. Creation & The Patriarchs (~4000–1800 BC)
2. Exodus & The Law (~1400–1200 BC)
3. Judges & Tribal Period (~1200–1050 BC)
4. United Kingdom — Saul, David, Solomon (~1050–930 BC)
5. Divided Kingdom & Prophets (~930–586 BC)
6. Babylonian Exile (~586–538 BC)
7. Return & Rebuilding (~538–400 BC)
8. The Silent Period / Intertestamental (~400 BC–4 BC)
9. Life of Jesus (~4 BC–33 AD)
10. Early Church & Apostolic Age (~33–100 AD)
11. Church Fathers & Canon Formation (~100–400 AD)
12. Medieval Church (~400–1500 AD)
13. Reformation & Translation (~1500–1700 AD)
14. Modern Era & Global Spread (~1700–Present)

### Era Data Structure

```typescript
interface Era {
  id: string;
  order: number;
  name: string;
  dateRange: string;
  tldr: string;
  keyFigures: Figure[];
  keyEvents: Event[];
  bibleBooks: string[];
  worldEvents: WorldEvent[];
  modernConnections: string[];
  goDeeper: Topic[];
}
```

### Library Categories

1. **books** — 66+ Bible books with metadata
2. **canon** — How Bible was assembled, removed books
3. **denominations** — All Christian branches explained
4. **theology** — Trinity, salvation, end times, etc.
5. **removed** — Gnostic gospels, Apocrypha, etc.
6. **authors** — Who wrote what
7. **authenticity** — Contradictions, later additions
8. **covenants** — OT vs NT, what changed

### Multi-Lens System

```typescript
type Lens =
  | "historical"    // Academic/archaeological
  | "protestant"    // Mainstream Protestant
  | "catholic"      // Catholic tradition
  | "orthodox"      // Eastern Orthodox
  | "jewish"        // Jewish interpretation
  | "islamic"       // Islamic perspective
  | "secular";      // Critical/skeptical scholarship

interface LensedContent {
  topicId: string;
  lens: Lens;
  content: string;
  keyPoints: string[];
  stakes: string;  // "Why this group cares"
}
```

### Content Generation Flow

```
User requests topic
        │
        ▼
Check content_cache
        │
    ┌───┴───┐
    │ MISS  │ HIT → Return cached
    └───┬───┘
        ▼
Generate via Claude
        │
        ▼
Generate lens perspectives
        │
        ▼
Generate embeddings (pgvector)
        │
        ▼
Cache everything, return
```

---

## Frontend Architecture

### Directory Structure

```
scripture-explorer/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (reader)/read/[book]/[chapter]/page.tsx
│   ├── (explorer)/
│   │   ├── timeline/page.tsx
│   │   ├── timeline/[eraId]/page.tsx
│   │   ├── library/page.tsx
│   │   └── library/[category]/[topicId]/page.tsx
│   ├── (chat)/ask/page.tsx
│   ├── (user)/
│   │   ├── profile/page.tsx
│   │   ├── notes/page.tsx
│   │   └── progress/page.tsx
│   ├── donate/page.tsx
│   ├── onboarding/page.tsx
│   └── api/
│       ├── bible/route.ts
│       ├── content/route.ts
│       ├── chat/route.ts
│       ├── embeddings/route.ts
│       └── stripe/route.ts
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── bible/
│   ├── timeline/
│   ├── library/
│   ├── chat/
│   ├── notes/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── bible-api/
│   ├── anthropic/
│   ├── embeddings/
│   └── utils/
├── hooks/
├── contexts/
└── styles/
```

### Navigation Structure

```
Bottom Nav (always visible on mobile):
├── 📖 Read
├── 🕐 Timeline
├── 📚 Library
├── 💬 Ask
└── 👤 Me
```

### Key UI Components

- **Breadcrumbs:** Always visible, shows current location
- **AutoBookmark:** Saves position when user explores tangents
- **ReturnButton:** Persistent "Return to [previous location]"
- **TextSizeSlider:** Accessibility control
- **LensSwitcher:** Toggle between perspectives

### Accessibility Implementation

- Text size multiplier stored in `PreferencesContext` (1.0/1.25/1.5/2.0)
- CSS custom properties: `font-size: calc(var(--base-size) * var(--text-multiplier))`
- Minimum tap targets: 48px
- Focus indicators on all interactive elements
- Semantic HTML with ARIA labels

---

## AI & RAG System

### RAG Pipeline

1. **Embed Query:** Send user question to embedding model
2. **Vector Search:** Find top 5-10 similar content chunks from pgvector
3. **Context Assembly:** Current page + RAG chunks + user preferences + response mode
4. **Claude API Call:** Stream response with assembled context

### Embedding Strategy

- **What gets embedded:** Cached content, lens perspectives, Bible chapter summaries, removed books summaries
- **Chunking:** ~500 tokens per chunk, 50 token overlap
- **Model:** OpenAI `text-embedding-3-small` (1536 dimensions)

### AI System Prompt

```markdown
You are a knowledgeable, non-biased guide to the Bible and Christianity.

TONE:
- Talk like a smart friend, not a professor or pastor
- Never assume the reader's faith — use "Christians believe..." not "We believe..."
- Don't skip uncomfortable parts — address violence, contradictions honestly
- Always explain WHY something matters
- Short paragraphs, max 3-4 sentences

PERSPECTIVES:
- Present all major viewpoints without declaring a winner
- Name your sources: "According to Catholic tradition..."

RESPONSE MODES:
- Quick: 1-2 paragraphs
- Deep: Comprehensive with cross-references
- ELI5: Simple language, modern analogies
- Scholar: Academic depth with sources

NEVER:
- Be preachy or devotional
- Declare one interpretation as "correct"
- Skip messy historical or textual complexities
```

### Chat Session Structure

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    currentPage: string;
    retrievedChunks: string[];
  };
}

interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  responseMode: 'quick' | 'deep' | 'eli5' | 'scholar';
  preferredLens?: Lens;
  createdAt: Date;
}
```

---

## External Integrations

### API.Bible

- **Translations:** KJV, ASV, WEB (free tier)
- **Rate Limits:** 5000 requests/day
- **Caching:** Store full chapters for 30 days
- **Pre-warming:** Cache common passages (John 3, Psalm 23, Genesis 1)

### Stripe

- **Flow:** Client → Checkout Session → Redirect → Webhook confirmation
- **Amounts:** Preset ($5, $10, $25, $50) + custom
- **No recurring:** MVP only, can add later

### Anthropic (Claude)

- **Model:** claude-sonnet-4-20250514
- **Streaming:** Enabled for chat
- **Max tokens:** 500 (quick) / 2000 (deep/scholar)

### OpenAI (Embeddings)

- **Model:** text-embedding-3-small
- **Dimensions:** 1536
- **Batch support:** Yes, for content ingestion

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
API_BIBLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## PWA Configuration

### Manifest

```json
{
  "name": "Scripture Explorer",
  "short_name": "Scripture",
  "description": "Explore the Bible from Genesis to modern day",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F0E6",
  "theme_color": "#8B7355"
}
```

### Offline Strategy

- Cache static assets indefinitely
- Cache recently viewed Bible chapters (last 20)
- Cache recently viewed timeline/library pages
- AI chat requires connection
- Notes sync when back online (optimistic updates)

---

## Deployment

### Platform: Vercel

- Environment variables in dashboard
- Automatic deployments from Git
- Edge functions for API routes (optional)
- Analytics integration

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Lighthouse Score | > 90 |

### Optimizations

- Server components by default
- Dynamic imports for heavy components
- Image optimization via `next/image`
- Font subsetting
- Aggressive caching headers

---

## Implementation Phases

### Phase 1: Core MVP

- Bible reader (KJV from API.Bible, cached)
- Timeline (14 eras, AI-generated content on-demand)
- AI chat (RAG-powered, context-aware)
- Basic bookmarking and reading position
- Text size accessibility setting
- Donation page (Stripe)
- PWA installable
- Mobile-responsive design

### Phase 2: Depth

- Library system (all 8 categories)
- Multi-lens perspective switcher
- Notes system (verse-attached and freeform)
- Multiple Bible translations
- Authenticity/contradiction annotations
- Removed books section
- User accounts and progress sync
- Highlights with colors

### Phase 3: Creator Tools

- Scripture card generator (shareable images)
- TikTok script generator
- Topic summary generator
- Share functionality
- Reading plans (predefined paths)

### Phase 4: Polish

- Audio/TTS for passages
- Full offline mode
- Web research integration
- Advanced progress tracking (streaks, stats)
- Dark mode refinement
- High contrast mode

---

## Content Tone Guidelines

1. **Talk like a smart friend**, not a professor or pastor
2. **Never assume the reader's faith** — use "Christians believe..." not "We believe..."
3. **Don't skip uncomfortable parts** — violence, sexuality, genocide, contradictions
4. **Always explain WHY something matters** — connect to larger story and modern relevance
5. **Use modern analogies** — "The Roman road system was basically the internet of the ancient world"
6. **Short paragraphs** — max 3-4 sentences
7. **TL;DR everything** — every topic starts with 1-2 sentence summary
8. **Name your sources/perspectives** — "According to Catholic tradition..." / "Most historians date this to..."

---

## Success Criteria

- A complete beginner can open it and immediately find something interesting
- An elderly person with poor eyesight can use it comfortably
- Someone with ADHD can explore freely without losing their place
- A person of any faith (or none) feels respected and intellectually engaged
- A content creator can use it to generate educational social media content
- It looks professional enough to be featured in a TikTok or YouTube video

---

## Open Questions / Future Considerations

- Community contributions and moderation (Phase 2+)
- Recurring donations (can add to Stripe integration)
- Additional translations requiring licensing partnerships
- Native mobile apps vs PWA (PWA for MVP)
- Content review dashboard for flagging AI-generated entries
