# Scripture Explorer: Learning Platform Pivot

**Date:** 2026-03-25
**Status:** Design Approved
**Author:** Collaborative design session

## Overview

Transform Scripture Explorer from a devotional Bible reading app into an intellectually honest learning platform about biblical history, origins, and hard questions. The app targets intellectually curious people and skeptical seekers who want to understand the Bible's origins, reliability, and the history of Christianity through fair presentation of evidence and scholarly debate.

## Vision

**Core principle:** Lead with honesty, trust the outcome. Present evidence fairly—including objections and hard questions—then show why the evidence points toward reliability and truth. This is intellectually honest apologetics, not propaganda.

**Primary audience:**
- The intellectually curious: wants to understand biblical history academically
- The skeptical seeker: has real objections, wants them addressed honestly

**Learning approach:**
- Guided exploration with curated content
- Layered depth: overview first, drill down when interested
- AI-generated content, human-reviewed for accuracy

## Information Architecture

### Five Pillars

The app reorganizes around five learning tracks:

1. **Text & Transmission** - How we got the Bible. Manuscripts, translations, textual variants, reliability evidence.

2. **Prophecy & Fulfillment** - Predictions examined. Dating debates, fulfilled vs. unfulfilled, the self-fulfilling prophecy question.

3. **Church & Empire** - How Christianity became an institution. Councils, schisms, Crusades, Reformation, historical atrocities.

4. **Christianity & Judaism** - Jewish roots, the parting of ways, Christian antisemitism, the Holocaust, modern dialogue.

5. **Branches & Beliefs** - Denominations explained. Why they split, what they disagree on, the landscape today.

### Pillar Structure

Each pillar contains:
- An introductory article (10-15 minute read)
- 10-20 topic entries (layered content)
- Connected Scripture passages
- Timeline placement where relevant
- Cross-links to related topics in other pillars

### Navigation

**Bottom bar:**
| Home | Explore | Bible | Progress | Settings |

- **Home** - Five pillars, recent activity, recommended next reads
- **Explore** - Browse all topics, search, filter by pillar
- **Bible** - Full Bible reader (existing functionality)
- **Progress** - Reading history, bookmarks, notes, saved articles
- **Settings** - Preferences, admin mode toggle

## Content Model

### Three-Layer Structure

Each topic entry has three layers of depth:

**Layer 1: The Hook (30 seconds)**
- One-sentence summary
- Why it matters / why skeptics raise it
- Displayed as card in listings

Example: *"The Council of Nicaea (325 AD) - Did the church 'invent' the Bible here? A common claim that misunderstands what actually happened."*

**Layer 2: The Overview (5-7 minutes)**
- What happened / what the evidence shows
- Main scholarly positions
- Key takeaways
- Default view when opening a topic

**Layer 3: The Deep Dive (expandable)**
- Primary source quotes
- Detailed timelines
- Scholarly debates with citations
- "But what about..." objection responses
- Links to related topics

### Content Metadata

```typescript
interface Topic {
  id: string;
  slug: string;
  title: string;
  pillar: 'text' | 'prophecy' | 'church' | 'judaism' | 'branches';
  status: 'draft' | 'review' | 'published';
  hook: string;
  overview: string; // markdown
  deepDive: DeepDiveSection[]; // expandable sections
  scriptureRefs: ScriptureRef[];
  relatedTopics: string[]; // topic IDs
  timelineEra?: string;
  createdAt: string;
  updatedAt: string;
}

interface DeepDiveSection {
  title: string;
  content: string; // markdown
}

interface ScriptureRef {
  bookId: string;    // Uses existing API.Bible format (e.g., "GEN", "JHN")
  chapter: number;
  verse: number;
  verseEnd?: number; // For ranges like "John 3:16-17"
}

// Note: bookId matches the existing BIBLE_BOOKS[].id format in lib/bible/books.ts
// This ensures compatibility with the existing Bible reading infrastructure
```

## Scripture Integration

### From Articles to Scripture
- Inline passage references in article text
- Tapping opens verse in slide-up panel (not full navigation)
- Option to read surrounding context
- Option to open full chapter in Bible reader

### From Scripture to Articles
- Callouts when reading relevant chapters: "Learn about this book's origins"
- Controversial passages link to relevant topic discussions
- Prophecy passages link to fulfillment analysis

### Existing Features Repurposed
- **Bookmarks** - Save articles and passages
- **Notes** - Attach to articles, not just verses
- **Highlights** - Work in article text too
- **Search** - Searches both Scripture and learning content

## Content Creation Workflow

### Admin Mode

**Security model:** This is a personal learning app, not a multi-user platform. Admin mode is a simple UI toggle stored in localStorage—no authentication required. The "hidden from casual view" aspect is just UX cleanliness (don't show edit buttons when reading), not security.

- Toggle in settings (simple on/off switch)
- When enabled: shows Edit buttons, draft topics, authoring tools
- When disabled: clean reader experience
- No password, no user accounts—this is your personal tool

### Topic Queue
- List of planned topics by pillar
- Status tracking: Not started → Drafting → In Review → Published
- Priority ordering

### AI Drafting
1. Select topic from queue
2. Click "Generate Draft"
3. AI produces all three layers using structured prompt
4. Prompt includes: topic title, pillar context, objections to address, related topics
5. Generation takes 30-60 seconds

### Review Interface
- Side-by-side: AI draft left, edits right
- Section-by-section approval
- Flag uncertain claims for fact-checking
- Add/edit Scripture references
- Add citations and sources
- Preview reader view

### Publishing
- Mark as published when satisfied
- Appears in pillar listing
- Can unpublish or edit anytime
- Version history preserved

## Technical Implementation

### Data Storage

**Directory structure (new, to be created):**
```
/content/
  /topics/
    /text/           # Text & Transmission pillar
    /prophecy/       # Prophecy & Fulfillment pillar
    /church/         # Church & Empire pillar
    /judaism/        # Christianity & Judaism pillar
    /branches/       # Branches & Beliefs pillar
    index.json       # Topic index for fast listing/search
```

- Each topic is a JSON file: `{slug}.json`
- Index file maintains list of all topics with metadata for listing pages
- Index rebuilt on topic create/update/delete
- Can migrate to database later if needed (SQLite or Postgres)

### API Routes
- `GET /api/topics` - List topics with filtering
- `GET /api/topics/[slug]` - Get single topic
- `POST /api/generate-topic` - AI draft generation
- `PUT /api/topics/[slug]` - Update topic (admin)
- `DELETE /api/topics/[slug]` - Delete topic (admin)

### AI Generation

Uses Claude API (existing `getAnthropicClient()` from `lib/ai/client.ts`).

**System prompt template:**
```
You are helping create educational content about biblical history and scholarship.

Generate a topic entry with three layers:

TOPIC: {title}
PILLAR: {pillar}
CONTEXT: {additional context or objections to address}

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

OUTPUT FORMAT: JSON matching the Topic interface
```

**Error handling:**
- Retry once on API failure
- Show error state with "Try Again" option
- Save partial drafts to prevent data loss

### Preserved from Current Codebase
- Bible reading infrastructure (API, translations, reader)
- UI component library (cards, buttons, layout)
- User data context (adapted for article progress)
- App shell and routing structure

### Rebuilt Components
- Home page (pillar-based)
- Navigation structure
- Article/topic components
- Content management system
- Admin interface

## Features to Remove

The following devotional features don't fit the learning focus:
- Prayer wall
- Memory verses
- Reading plans (replaced by learning paths)
- Achievements/streaks (may return redesigned for learning progress)

## Phased Rollout

### Phase 1: Foundation (MVP)

**Build order within Phase 1:**
1. Content infrastructure (data model, API routes, storage)
2. Admin mode and AI drafting workflow
3. Generate and review 25 seed topics (5 per pillar)
4. Reader UI (topic listing, article view, three layers)
5. Home page with pillar navigation
6. Scripture slide-up panel
7. Basic progress tracking (Read/Unread)

**Seed topics (created as part of Phase 1, not a prerequisite):**
- 5 topics per pillar, 25 total
- Generated via AI drafting, reviewed by you
- Focuses on the most important/common questions per pillar
- App is usable once ~10-15 topics are published

**Example seed topics per pillar:**
- **Text:** Dead Sea Scrolls, Council of Nicaea, Textual Variants, Canon Formation, Translation History
- **Prophecy:** Isaiah's Cyrus Prediction, Daniel's Dating Debate, Messianic Prophecies, Destruction of Temple, Suffering Servant
- **Church:** Constantine's Conversion, Great Schism, Reformation, Crusades, Inquisition
- **Judaism:** Jewish Roots of Jesus, Parting of Ways, Medieval Antisemitism, Holocaust, Modern Dialogue
- **Branches:** Catholic vs Orthodox, Protestant Reformation, Denominational Differences, Creeds & Councils, Modern Movements

### Phase 2: Integration
- Connect Bible reader to learning content
- Enhanced timeline linking
- Search across articles and Scripture
- Notes and bookmarks on articles

### Phase 3: Depth
- Expand to 15-20 topics per pillar
- Cross-pillar connections and recommendations
- Learning paths (curated sequences)
- Citation and source management

### Phase 4: Polish
- Reading statistics and visualization
- Export/share articles
- Offline reading
- Community features (if desired)

## Success Criteria

1. **Content quality** - Articles accurately represent scholarly consensus and debates
2. **Intellectual honesty** - Hard questions addressed, not dodged
3. **Engaging UX** - Layered content keeps readers exploring
4. **Scripture connection** - Learning enhances Bible understanding, not replaces it
5. **Sustainable creation** - AI drafting + human review enables steady content growth

## Open Questions

1. **Content licensing** - If quoting primary sources extensively, what are the copyright considerations?
2. **Scholarly review** - Should some topics be reviewed by subject matter experts beyond your own review?
3. **Versioning** - How to handle updates when scholarship evolves or you learn you got something wrong?
4. **Tone calibration** - How to balance accessibility with academic rigor?

---

*This design document was created through collaborative brainstorming. Ready for implementation planning.*
