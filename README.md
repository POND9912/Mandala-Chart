# Mandala AI — clickable prototype

A working Next.js build of the wireframe: Login → Gallery (multiple charts) →
Chart overview → Sub-goal drill-down → Progress, plus the "New chart" AI-assisted
creation flow and the Admin analytics dashboard. Fully responsive (one
codebase, Tailwind breakpoints — not separate mobile/desktop files).

**What's real vs. mocked:** All screens, navigation, and the responsive layout
are real. There is no backend yet — data lives in `lib/data.js`, "login" just
navigates to the gallery, and the "AI" buttons (generate sub-goals, generate
actions, regenerate) pick from a small local list of alternates instead of
calling a real model. Swap `lib/data.js` for real API calls when the backend
exists; the components don't need to change.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/login`.

## Auth & database (Login / Register / roles)

Stack: PostgreSQL (Docker) + Prisma + NextAuth v4 — email/password and Google.

```bash
cp .env.example .env      # then fill NEXTAUTH_SECRET, ADMIN_EMAIL/PASSWORD, (optional) Google keys
npm run db:up             # start Postgres on localhost:5434
npm run db:migrate        # create tables
npm run db:seed           # create the first ADMIN from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```

- **Roles:** `USER` (default for everyone who registers) and `ADMIN`.
  `middleware.js` sends signed-out users to `/login` and non-admins away from
  `/admin`; the admin page re-checks on the server too. To promote someone,
  change `role` in `npm run db:studio`, or set them as `ADMIN_EMAIL` and re-seed.
- **Google:** the button only appears when `GOOGLE_CLIENT_ID` and
  `GOOGLE_CLIENT_SECRET` are set. Redirect URI:
  `http://localhost:3000/api/auth/callback/google` (plus your production URL).
  Signing in with Google using an email that already registered with a
  password links to that same account.

## Deploy to Vercel

With the database: create a **Neon** Postgres from the Vercel project's
Storage tab (it sets `DATABASE_URL` and `DATABASE_URL_UNPOOLED` for you),
then add `NEXTAUTH_SECRET` (fresh value), `NEXTAUTH_URL` (your production
URL) and, for Google login, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` plus
the redirect URI `https://<your-domain>/api/auth/callback/google`.
Vercel runs `npm run vercel-build`, which applies pending migrations before
building. Create the first admin by running `npx prisma db seed` locally with
`DATABASE_URL` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` pointed at production.


I can't push to your Vercel account from here, but either of these takes a
couple of minutes:

**Option A — GitHub (recommended)**
1. Push this folder to a new GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import that repo.
3. Framework preset auto-detects as Next.js — add the env vars above, then click **Deploy**.

**Option B — CLI, no GitHub needed**
```bash
npm i -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # promote to your production URL
```

## Structure

```
app/
  login/                         /login
  gallery/                       /gallery  (filter pills, card/compact toggle, collapsible "done")
  new/                           /new              step 1 — enter goal
  new/subgoals/                  /new/subgoals      step 2 — review AI sub-goals
  chart/[id]/                    /chart/fullstack           overview (3x3 grid)
  chart/[id]/subgoal/[subId]/    .../subgoal/ทักษะเขียนโค้ด  action plan
  chart/[id]/progress/           .../progress               heatmap, streak, badges
  admin/                         /admin            aggregate stats + expert leaderboard
components/                      shared Header, MiniHeatmap, ProgressRing, ChartTabs
lib/data.js                      all mock data + the "AI" mock helpers
```

## Suggested next steps

- Real auth (NextAuth / Clerk / Supabase Auth) behind `/login`
- A database (Postgres via Prisma/Drizzle, or Supabase) replacing `lib/data.js`
- The Anthropic API for the actual sub-goal/action generation and the AI
  insight copy on the overview and admin pages
- Aggregate-only queries for `/admin` so it never touches a user's raw chart
  content (see the earlier design notes on this)
- Real push notifications — see below

## Notifications

Short answer: yes, a responsive web app can do this via the Web Push API —
it's not something exclusive to native apps. This section is both a status
report (what's built) and the design spec for the parts that need a real
backend to finish.

### What's in this build

- `public/manifest.json` + `public/sw.js` — makes the app installable
  (Add to Home Screen / desktop install) and registers a service worker.
- The bell icon on `/gallery` requests notification permission and fires a
  real OS-level notification using the exact selection logic described below
  — this is a live demo of what a scheduled push would say, minus the
  schedule.
- `randomDailyAction()` in `lib/data.js` is written so the demo and a future
  server-side cron job can share the same logic — swap its data source for
  a real DB query and the behavior stays identical.

### iOS caveat

Safari on iPhone only allows notification permission for sites added to the
Home Screen as a PWA first (iOS 16.4+) — a regular Safari tab can't ask at
all. The bell detects this and explains it instead of silently failing.
Android Chrome and desktop browsers have no such restriction.

### Design decisions for multiple Mandala Charts

**Every notification carries chart context, not just an action string.**
The payload shape is `{ chartId, chartTitle, subgoalId, subgoalTitle, id,
label }`. Two consequences:
- The notification body always names the chart it's from (e.g. "เป็น
  Full-stack Developer ภายใน 1 ปี" as the title, "ทักษะเขียนโค้ด • อ่าน docs
  React 15 นาที" as the body) — a bare action string would be ambiguous once
  there's more than one chart.
- Clicking deep-links straight to `/chart/{chartId}/subgoal/{subgoalId}`
  instead of dropping the user on the gallery to go hunting for it.

**Priority / which chart gets picked.** Went with momentum-weighted
selection over plain "1 of 64 at random" (the original spec) for two
reasons: a chart at 95% shouldn't compete equally with one you just started,
and reinforcing whatever chart you *just* checked into matches how habit
apps like Duolingo actually build streaks. Implementation:
- Finished charts (`status: 'done'`) are excluded entirely — nothing left to
  nudge about.
- Each active chart carries a `momentum` weight (mocked as a static number
  per chart right now; a real backend would derive it from days-since-last-
  check-in). Candidates are pooled across all active charts' unfinished
  actions and picked with weighted random selection, so a quiet chart can
  still come up — just less often than one you're actively building a streak
  on.
- If this turns out to annoy people in testing, the simpler fallback is pure
  uniform random across all unfinished actions in active charts — that's a
  one-line change (drop the weight, `Math.random() * candidates.length`).

**Closed tab / closed browser.** Real push (not this demo) still fires here
— that's the whole point of the Web Push API. Once a device subscribes, the
browser's push service (FCM for Chrome, APNs for Safari) keeps listening in
the background even with the app fully closed, same as a native app.

**Logged out.** Not a technical limitation either way — a push subscription
is tied to the browser/device, not to login state, so nothing stops it from
firing after logout unless we deliberately unsubscribe. Recommended
behavior once real auth exists: call `PushSubscription.unsubscribe()` on
logout. Reasons: (1) privacy, if someone else uses the same device next;
(2) it's a confusing experience to be reminded about a goal on an account
you just signed out of. The browser's notification *permission* itself
stays granted across logout — signing back in can resubscribe immediately
without asking again.

### What's still needed for real scheduled push

The demo above only fires while the tab is open. An actual "once a day,
even if the app isn't open" reminder needs:
1. Store each device's `PushSubscription` (from `PushManager.subscribe()`)
   in a database, keyed by user
2. Generate VAPID keys and send pushes with a library like `web-push` from
   a server/serverless function
3. A scheduled trigger — [Vercel Cron](https://vercel.com/docs/cron-jobs)
   running daily, running the momentum-weighted pick per user against real
   data, and pushing the result
4. On logout, call `unsubscribe()` and delete that device's stored
   subscription
5. The `push` handler in `public/sw.js` already expects the payload shape
   above — it just has nothing sending to it yet

#   M a n d a l a - C h a r t 
 
 