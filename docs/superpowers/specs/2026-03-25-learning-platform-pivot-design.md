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
  book: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
}
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
- Toggle in settings (hidden from casual view)
- When enabled: shows Edit buttons, draft topics, authoring tools
- When disabled: clean reader experience

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
- Topics stored as JSON files in `/content/topics/`
- Indexed for search and filtering
- Can migrate to database later if needed

### API Routes
- `GET /api/topics` - List topics with filtering
- `GET /api/topics/[slug]` - Get single topic
- `POST /api/generate-topic` - AI draft generation
- `PUT /api/topics/[slug]` - Update topic (admin)
- `DELETE /api/topics/[slug]` - Delete topic (admin)

### AI Generation
- Uses Claude API with carefully crafted system prompt
- System prompt ensures:
  - Consistent three-layer structure
  - Intellectually honest tone
  - Citations and source references
  - Connection suggestions to related topics

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
- New home page with five pillars
- Topic listing and reading experience (all three layers)
- 5 seed topics per pillar (25 total)
- Scripture slide-up panel from articles
- Basic progress tracking (Read/Unread)
- Admin mode for content editing

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
