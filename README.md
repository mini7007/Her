# If You Could Hear My Heart ❤️

*A personal cinematic love letter, apology and reconciliation experience — for Bacha, from Mohan.*

Eight connected scenes unfold inside one persistent application shell: an opening invitation, the story since **18 September 2023**, an honest apology, the quiet absence, the complete love letter, the commitments, their songs, and one final question asked with hope — and zero pressure.

---

## Contents

1. [The experience](#the-experience)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Local development](#local-development)
5. [Supabase setup (database + owner auth)](#supabase-setup)
6. [Resend setup (email notifications)](#resend-setup)
7. [Audio assets](#audio-assets)
8. [Editing your personal content](#editing-your-personal-content)
9. [Deploying to Vercel](#deploying-to-vercel)
10. [Security & privacy notes](#security--privacy-notes)
11. [Timezone handling](#timezone-handling)
12. [Production verification checklist](#production-verification-checklist)
13. [Implementation report](#implementation-report)

---

## The experience

| # | Scene | What happens |
|---|-------|--------------|
| 01 | **Hey, Bacha...** | Cinematic opening — petals, a soft heartbeat, and *"Open my heart ❤️"*. Music never auto-starts; she chooses it. A subtle *skip straight to the letter* link is included. |
| 02 | **Our Story** | Live counter (years/months/days/hours/minutes/seconds, updates every second) since 18 September 2023, plus a six-chapter memory timeline. |
| 03 | **Where I Went Wrong** | The apology — exact, honest words, no excuses. |
| 04 | **Your Absence** | A rainy window, distant lights, and what the little silence feels like. |
| 05 | **The Letter** | The envelope opens, the letter rises, and the **complete, unabridged letter** is revealed. A *Read the whole letter* control disables all reveal animations — nothing is ever hidden behind an interaction. |
| 06 | **What I Want to Change** | Six commitments + the honest closing. |
| 07 | **Our Songs** | Full music player (play/pause, prev/next, volume 35% default, mute, seek, repeat modes, playlist). The player is persistent — it never restarts between scenes. |
| 08 | **The Quiet Question** | One question, four **equally respectful** options, an optional 3000-character message, a single honest submission, and a peaceful acknowledgement of whatever she decides. |

Her response is stored in Supabase, and Mohan receives an email — *"Bacha has responded to your letter ❤️"* — with a private dashboard link at **/owner**.

## Tech stack

- **Next.js (App Router) + TypeScript** — server components where practical; client components only where interaction requires them
- **Tailwind CSS** — the custom cinematic design system (midnight/burgundy/wine/rose/champagne/ivory)
- **Framer Motion** — choreography with `MotionConfig reducedMotion="user"` throughout
- **Lucide React** — quiet, line-based icons
- **Supabase PostgreSQL** — response storage + owner authentication (RLS, service-role access server-side only)
- **Resend** — email notification after a confirmed database insert
- **Vercel** — hosting

## Project structure

```
src/
  app/
    layout.tsx                 # fonts, metadata (noindex), theme color
    page.tsx                   # renders the ExperienceShell
    globals.css                # design tokens, paper, rain, grain
    icon.svg                   # favicon
    opengraph-image.tsx        # generated OG preview
    robots.ts                  # disallow all indexing
    owner/
      page.tsx                 # server-verified private dashboard
      login/page.tsx
    api/
      responses/route.ts       # POST — her submission (validated, rate-limited)
      owner/responses/route.ts # GET/PATCH — owner-only, re-verified per call
  components/
    layout/                    # ExperienceShell, navigation, background, veil…
    scenes/                    # the eight scenes
    music/                     # MusicProvider (persistent <audio>), players
    timeline/                  # counter + timeline
    owner/                     # dashboard UI
  content/
    relationship.ts            # ← ALL personal words live here
  hooks/                       # useNow, useClientToken
  lib/
    supabase/                  # browser / server / admin clients
    email/                     # Resend notification
    validation/                # server-side submission validation
    security/                  # rate limiting, sanitization
    owner/                     # server-side owner authorization
supabase/migrations/
  001_relationship_responses.sql
public/
  music/                       # ← khat.mp3, faasle.mp3, alfaaz.mp3 go here
  images/                      # ← memory photos go here
```

## Local development

```bash
npm install
cp .env.example .env.local    # then fill in the values (see sections below)
npm run dev                   # http://localhost:3000
```

Other commands:

```bash
npm run typecheck   # strict TypeScript, zero errors expected
npm run lint        # eslint (next/core-web-vitals + next/typescript)
npm run build       # production build
npm start           # serve the production build locally
```

The site **builds and runs even with empty env vars** — scenes, music and the UI all work; the response form and /owner show graceful "not configured" states until Supabase/Resend are set up.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (PostgreSQL is provisioned automatically).
2. **Run the migration** — open *SQL Editor* and paste the contents of
   [`supabase/migrations/001_relationship_responses.sql`](supabase/migrations/001_relationship_responses.sql), then *Run*.
   (Or use the Supabase CLI: `supabase db push`.)
   This creates `relationship_responses` + `response_rate_limits` with RLS enabled and **no public policies** — only the server-side service-role key can read or write.
3. **Create the owner account** — open *Authentication → Users → Add user*:
   - Email: `mohan5050390@gmail.com`
   - Password: choose a strong private password
   - ✅ Auto-confirm user: ON
4. **Copy your keys** — *Project Settings → API*:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**server-only — never expose**)
5. Set `OWNER_EMAIL=mohan5050390@gmail.com`.

**How owner auth works:** `/owner` verifies the caller with Supabase Auth (`getUser()` over the network, using httpOnly cookies) **and** requires the email to equal `OWNER_EMAIL`. The API route re-verifies on every request. There is no frontend-only check and no hidden-route "security".

## Resend setup

1. Create an account at [resend.com](https://resend.com) and generate an **API key** → `RESEND_API_KEY`.
2. **Sending address** — with no custom domain, notifications are sent from Resend's test sender `onboarding@resend.dev`, which can deliver **to your own account email** (`mohan5050390@gmail.com`). For a branded sender, verify a domain in Resend and set `RESEND_FROM="Mohan <love@yourdomain.com>"`.
3. The notification fires **only after** the database insert succeeds. If Resend is down or misconfigured, her response is still safely stored — you'll simply miss the email (check the dashboard).

## Audio assets

Place the three songs in `public/music/` with the exact lowercase names:

```
khat.mp3  ·  faasle.mp3  ·  alfaaz.mp3
```

⚠️ **Do not pirate or rip commercial songs.** Use music you have rights to, or your own recordings. Details and encoding tips: [`public/music/README.md`](public/music/README.md). If a file is missing, the player shows a gentle error and the rest of the experience works perfectly — everything is usable without music, by design.

## Editing your personal content

Everything personal lives in **[`src/content/relationship.ts`](src/content/relationship.ts)**:

- `sender` / `recipient` names
- `relationshipStartDateISO` — the counter and timeline anchor
- `opening`, `apology`, `absence`, `letter`, `commitments`, `final` — every word on every screen (the letter is complete; each paragraph is a separate reveal, so gentle additions are safe)
- `story.memories` — add real memories with date, title, description, optional photo/caption (shape documented in the file; **empty states are shown until you add real ones**)
- `music.tracks` — titles, artists, file paths

No UI component needs to be touched to change any word.

## Deploying to Vercel

1. Push this folder to a **private** Git repository (GitHub/GitLab).
2. On [vercel.com](https://vercel.com) → *Add New → Project* → import the repo (framework auto-detected as Next.js).
3. Add **all** environment variables from `.env.example` under *Settings → Environment Variables* (Production + Preview).
4. Deploy. Then update `NEXT_PUBLIC_SITE_URL` to the final URL and redeploy once so email links point to the right place.
5. Optional: use a custom domain with HTTPS (automatic on Vercel).

> Note: an unlisted Vercel URL is **not** a password-protected space — it is simply hard to find. The site uses `noindex` + a robots policy against indexing (courtesy signals, not access controls); her *response data* is genuinely protected by Supabase Auth + RLS + service-role-only server access.

## Security & privacy

- ✅ Response validated, sanitized and length-capped **server-side**
- ✅ Honeypot field + Supabase-backed rate limiting (works across serverless instances; raw IPs are hashed with a pepper and never stored)
- ✅ Accidental duplicate submissions collapsed via a device idempotency token
- ✅ RLS enabled with **zero public policies**; all data access via the service-role key behind owner verification
- ✅ Owner session re-verified server-side for every dashboard/API call; secure httpOnly cookies
- ✅ DB insert confirmed **before** success is shown; email failure never undoes a save
- ✅ No read-tracking, location tracking, camera/mic access, contact harvesting, follow-up automation, countdowns, or forced answers
- ❌ `.env.local` is git-ignored; no secrets in the client bundle

## Timezone handling

The relationship counter parses `2023-09-18` as **local midnight in the visitor's timezone** and ticks with the visitor's local clock — the most intuitive frame for "how long we've been us". No server timezones are involved. The response timestamp is stored as `timestamptz` (absolute time) and displayed in the dashboard in the viewer's locale; the notification email renders it in `Asia/Kolkata`.

## Production verification checklist

- [ ] `npm run typecheck` and `npm run lint` pass locally
- [ ] `npm run build` succeeds with env vars set
- [ ] Migration applied in Supabase; `relationship_responses` + `response_rate_limits` exist with RLS enabled
- [ ] Owner account created in Supabase Auth (email = `OWNER_EMAIL`)
- [ ] `POST /api/responses` saves a row; success screen appears **only after** the insert
- [ ] Email arrives at `mohan5050390@gmail.com` with the correct response/message/time
- [ ] `/owner` redirects to login when signed out; wrong credentials rejected; signing in as the owner shows the dashboard; mark read/unread + filters work
- [ ] Another Supabase account (test email) **cannot** read the dashboard or the API
- [ ] Rapid double-taps on *Send* produce exactly one row
- [ ] Fourth rapid submission from one device gets a kind 429
- [ ] Music: missing files degrade gracefully; once playing, it continues across scene changes; pause/mute work anywhere
- [ ] Mobile (360–430 px): no horizontal scroll, nav + mini-player don't cover content, letter is readable, form is easy
- [ ] Reduced-motion (OS setting): animations collapse to gentle fades, all text readable
- [ ] Search engines: `noindex` metadata + robots disallow all

## Implementation report

**Completed**

- Full 8-scene persistent-shell experience with the exact master-prompt copy (complete letter, all scenes, all options)
- Central content config (`src/content/relationship.ts`) with editing guide comments
- Live relationship counter (1s updates, calendar-accurate, local time) + six-chapter timeline with honest empty states
- Persistent music provider: explicit start, 35% default volume, repeat modes, playlist, mini-player, graceful missing-file states, no autoplay
- Supabase migration (responses + rate limits, RLS, constraints, indexes), validated + rate-limited + honeypotted + deduped `POST /api/responses`, insert-before-success ordering, best-effort Resend email
- Owner dashboard with Supabase Auth (server-verified on every operation), filters, read/unread, responsive UI
- noindex/robots, OG image, favicon, theme color, reduced-motion, keyboard navigation, safe-area handling

**Pending (requires Mohan's credentials/assets — by design, nothing is faked)**

- Actual audio files in `public/music/` (copyright-respecting sources)
- Real memory photos + entries in the timeline
- Supabase project creation, owner account creation, migration execution
- `RESEND_API_KEY` (works immediately with `onboarding@resend.dev` → your own email)
- Vercel deployment (import repo + env vars; ~5 minutes)
- Final mobile-device spot check after deployment

---

*Built with patience, for one person. If you're reading this and you're not her — thank you for respecting a private letter.* ❤️
