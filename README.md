# Scripture Explorer

An interactive Bible study platform for exploring Scripture from Genesis to modern day.

## Features

- **Bible Reader** - Read all 66 books with verse navigation
- **Timeline** - Explore 14 eras of biblical history
- **AI Chat** - Ask questions powered by Claude AI
- **Multi-Lens Views** - 7 interpretation perspectives
- **Donations** - Support via Stripe
- **PWA** - Install on mobile devices

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- API keys for services (see below)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd scripture-explorer

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Add your API keys to .env.local
```

### Required API Keys

1. **API.Bible** - Free at https://scripture.api.bible
2. **Anthropic** - For AI features at https://console.anthropic.com
3. **OpenAI** - For embeddings at https://platform.openai.com
4. **Stripe** - For donations at https://stripe.com
5. **Supabase** - For database at https://supabase.com

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables

Configure these in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
API_BIBLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Claude (Anthropic) + OpenAI Embeddings
- **Payments**: Stripe
- **Bible API**: API.Bible

## Project Structure

```
app/
├── (main)/          # Main app routes with bottom nav
│   ├── read/        # Bible reader
│   ├── timeline/    # Historical timeline
│   ├── library/     # Topic library
│   ├── ask/         # AI chat
│   └── profile/     # Settings
├── api/             # API routes
└── onboarding/      # First-time setup

components/
├── bible/           # Bible-specific components
├── chat/            # Chat interface
├── donate/          # Donation forms
├── layout/          # App shell components
├── timeline/        # Timeline components
└── ui/              # shadcn/ui components

lib/
├── ai/              # AI clients and prompts
├── bible/           # Bible data and API
├── stripe/          # Stripe integration
├── supabase/        # Database client
└── timeline/        # Timeline data
```

## License

MIT
