# MateNote

**Turn YouTube videos into creator insights.**

Paste a YouTube video. MateNote transcribes it, analyzes it with AI, and hands
back a summary, key takeaways, a hook breakdown, the video's structure, key
moments, content ideas you could make yourself, and reusable creator
takeaways — all backed by real transcript extraction and a real LLM call, not
mocked data.

MateNote is built to be more than a transcript tool: it's a research
workspace for creators — a place to analyze videos, study what other
creators are doing, and turn what you find into your own content ideas.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** for styling, with a hand-built design system (no component library dependency)
- **Supabase** — Postgres database + auth (email/password and Google OAuth)
- **OpenAI API** — structured, schema-validated analysis via the Responses API
- **`youtube-transcript`** — transcript extraction, no scraping infrastructure to run yourself
- **Zod** — runtime validation for all AI output and API input

## How it works

1. A user pastes a YouTube URL (on the landing page, or from `/analyze`).
2. `POST /api/analyze` validates the URL, then:
   - Checks whether this video has already been analyzed (global cache, keyed by YouTube video ID) — if so, it's returned instantly and the AI is never called again.
   - Otherwise: fetches video metadata (`lib/youtube/metadata.ts`, via YouTube's public oEmbed endpoint — no API key required), extracts the transcript (`lib/transcript`), and sends the transcript to OpenAI for structured analysis (`lib/ai/analyze.ts`), validated against a Zod schema before it's ever stored or rendered.
   - Persists the result to Supabase and (if the user is logged in) adds it to their personal library.
3. The user is redirected to `/analysis/[id]`, a shareable page with tabs for Overview, Hook, Structure, Ideas, and Transcript.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page and
`/analyze` flow will run immediately once `OPENAI_API_KEY` is set — Supabase
is optional for a first look, but required to persist analyses, use
accounts, or reach `/dashboard`, `/saved`, `/research`, `/trends`.

### Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

```bash
cp .env.example .env.local
```

| Variable | Required for | Notes |
|---|---|---|
| `OPENAI_API_KEY` | AI analysis | Get one at platform.openai.com/api-keys |
| `OPENAI_MODEL` | — | Optional, defaults to `gpt-4.1-mini` |
| `YOUTUBE_API_KEY` | Research page, Trends page, exact video duration | Optional. Without it, MateNote still works end-to-end (via YouTube's oEmbed endpoint for metadata) — Research/Trends show a clear "not configured" state instead of faking data |
| `NEXT_PUBLIC_SUPABASE_URL` | Accounts, saving, dashboard | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Accounts, saving, dashboard | |
| `SUPABASE_SERVICE_ROLE_KEY` | Writing analyses to the DB | Server-only, never sent to the browser |

MateNote is designed to degrade honestly, not fake functionality: any
feature that needs an unconfigured integration shows a clear "this isn't
connected yet" state instead of pretending to work.

### Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) — it creates the `analyses` and `saved_items` tables with row-level security policies.
3. Copy your project URL and anon key from **Settings → API** into `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
4. (Optional) To enable **Google OAuth**: in the Supabase dashboard go to **Authentication → Providers → Google**, add your Google OAuth client ID/secret, and set the redirect URL to `{your-app-url}/auth/callback`.
5. In **Authentication → URL Configuration**, add your local (`http://localhost:3000`) and production URLs as allowed redirect URLs.

### Setting up OpenAI

Create an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
and set `OPENAI_API_KEY`. MateNote uses the Responses API with a Zod-derived
JSON schema (`lib/ai/schema.ts`), so the model's output is validated before
it ever reaches the database or the UI — no free-text parsing.

### Setting up YouTube

No key is required for the core analyze flow — video metadata comes from
YouTube's public oEmbed endpoint, and transcripts come from YouTube's public
caption tracks via the `youtube-transcript` package.

A `YOUTUBE_API_KEY` (from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
with the **YouTube Data API v3** enabled) unlocks:

- Exact video duration everywhere (otherwise shown as unavailable)
- The **Research** page (`/research`) — searching creators/topics/videos
- The **Trends** page (`/trends`) — real trending videos for your region

### How transcripts are obtained

MateNote reads YouTube's own public caption tracks (auto-generated or
creator-uploaded) via the `youtube-transcript` package — no audio
transcription, no third-party STT service, no extra cost. If a video has no
captions available, MateNote says so plainly (`We couldn't analyze this
video — this video doesn't appear to have an accessible transcript`)
instead of guessing.

## Scripts

```bash
npm run dev      # start the dev server (Turbopack)
npm run build    # production build
npm run start    # run the production build
npm run lint     # ESLint
```

## Project structure

```
src/
  app/
    page.tsx                 # landing page
    (auth)/login, /signup     # auth pages
    (app)/dashboard, /analyze,
          /research, /saved,
          /trends, /settings   # authenticated app shell
    analysis/[id]/             # shareable analysis page
    api/                       # route handlers (analyze, saved, research, trends...)
  components/
    ui/                        # design-system primitives (button, card, tabs, ...)
    marketing/, brand/, auth/,
    app/, analyze/, analysis/  # feature components
  lib/
    youtube/                   # URL parsing, oEmbed metadata, Data API search/trending
    transcript/                # transcript fetch + block-segmentation
    ai/                        # OpenAI client, Zod schemas, analysis + cross-video pattern generation
    db/                        # Supabase row types + query functions
    supabase/                  # browser/server/admin clients, auth proxy
supabase/schema.sql             # database schema + RLS policies
```

## Cost control

- Every analysis is cached globally by YouTube video ID — the same video is
  never re-transcribed or re-analyzed for a second user.
- Transcript extraction and AI analysis are separate steps, so the
  transcript is only ever fetched once per video.
- A basic in-memory rate limiter guards `/api/analyze` and the research/trends
  endpoints against abuse (documented as a known limitation below).

## Known limitations

- The rate limiter is in-memory and per-instance — fine for a single-instance
  deployment, but won't coordinate across multiple server instances. Swap in
  a Redis-backed limiter (e.g. Upstash) before scaling horizontally.
- Trend detection compares videos already in a user's own saved library
  (up to their 8 most recent) rather than crawling the wider platform —
  there's no third-party "trend data" source to plug into for MVP scope.
- Google OAuth requires you to configure a Google Cloud OAuth client
  yourself in the Supabase dashboard; MateNote just wires up the button and
  callback route.

## Next steps

- Multi-video comparison UI (select several saved analyses and diff them side by side)
- Creator profile pages that aggregate everything analyzed from one channel
- Team/workspace accounts for shared research libraries
- Webhooks / export to Notion for saved analyses
