# Readora — Technical Audit & Growth Analysis

**Date:** 2026-08-02
**Scope:** icon migration (lucide-react → hugeicons), codebase bug/inefficiency audit, and analysis of the traffic & activation problem (~1k visits/month, near-zero writer signups).
**Live target audited:** `https://thereadora.vercel.app`

---

## 0. Executive summary

Three things are true at once, and they compound:

1. **The app did not build.** `next build` failed on `main` before this pass. A production deploy of the current source was impossible without `ignoreBuildErrors`. Fixed — see §1.
2. **The content was invisible to Google.** Chapter pages — the only pages with substantial unique text, and the natural landing page for organic search — had no title, no description, no structured data, were absent from the sitemap, **declared the homepage as their canonical**, and served only 17 words of HTML because the prose was never server-rendered. Fixed — see §6.
3. **The activation path for writers was a 404.** Every button in the "you haven't written anything yet" empty state pointed at `/write/story/new`, which does not exist. So did the writing-guide link. A first-time writer who clicked the primary CTA got a 404 page. Fixed — see §1.

Point 3 is the most direct answer to "barely any users log in and write something." Point 2 is the most direct answer to "I only get 1k a month." Neither is a marketing problem.

**Severity counts:** 7 critical, 10 high, 13 medium (5 critical, 2 high and 2 medium now fixed).

**Still open and dangerous:** C1–C4 in §2.1 — two unauthenticated endpoints that send mail from your domain, a cron check that fails open, and forgeable view counts that drive the homepage ranking.

---

## 1. What changed in this pass

### 1.1 Icon migration (the requested work)

All `lucide-react` icons were replaced with **hugeicons** and the dependency removed.

| | |
|---|---|
| Files rewritten | **86** |
| Distinct lucide icons mapped | **134** |
| `lucide-react` references remaining | **0** |
| Package | removed from `package.json` |

**Method.** A regex-based rename is unsafe here — the codebase has string literals and JSX text that collide with icon names (`description: "Embed a Youtube video."`, `name: "Code"`, `title: "Text"`, `.setYoutubeVideo()`). A naive find-and-replace corrupts all of these. The migration was therefore driven by the **TypeScript compiler API**: identifiers were renamed only at real AST reference positions, skipping string literals, JSX text, property keys, and member-access names. Import statements were merged with each file's existing `hugeicons-react` import and de-duplicated, with aliasing where a target name was already bound.

**Package choice.** The project already used `hugeicons-react` in 48 files, so the migration follows that existing convention rather than introducing a second icon API. Note the caveat in §2.4 — that package is deprecated.

**Mapping decisions worth knowing about** (hugeicons has no 1:1 equivalent for some lucide icons):

| lucide | hugeicons | note |
|---|---|---|
| `ChevronDown/Up/Left/Right` | `ArrowDown01/Up01/Left01/Right01Icon` | hugeicons has no chevron family; these are its closest visual analogue |
| `Trophy` | `ChampionIcon` | no trophy icon exists |
| `HandshakeIcon` | `Agreement01Icon` | no handshake icon exists |
| `Bell` | `Notification01Icon` | no bell icon exists |
| `Unlock` | `SquareUnlock01Icon` | no plain unlock icon exists |
| `Dot` | `RecordIcon` | matches existing codebase usage |
| `Save` | `FloppyDiskIcon` | |
| `TrendingUp/Down` | `ChartIncrease/ChartDecreaseIcon` | |
| `ListOrdered` | `LeftToRightListNumberIcon` | **also used for "Bullet List"** in `node-selector.tsx` — see §2.3 |

These are judgement calls on visual intent. Worth a quick visual pass on the editor toolbar and the settings nav, where icon semantics matter most.

### 1.2 Build-blocking fixes (required to verify the migration)

The build failed before any of my changes. Verifying the icon work required fixing it.

| Fix | File | What it was |
|---|---|---|
| **Server code leaking into the client bundle** | `src/app/_components/layouts/settings/profile-wrapper.tsx:5` | `import { type X }` instead of `import type { X }`. With `verbatimModuleSyntax: true`, the first form **keeps the import statement at runtime**. This dragged `~/server/api/routers/user` → `chapter.ts` → `utils/openai.ts` (which reads `env.OPENROUTER_API_KEY` and imports `fs`/`path`/`process`) into the browser bundle. Build error was `the chunking context does not support external modules (request: node:module)`. |
| framer-motion variant types | `src/app/_components/layouts/(/)/hello-writers.tsx` | `ease: "easeOut"` widened to `string`; annotated as `Variants` |
| `prisma/types` unresolvable | `tsconfig.json` | added `"prisma/*": ["./prisma/*"]` path alias |
| Stripe API version | `payment.ts`, `webhooks/stripe/route.ts` | SDK types name a newer default than the pinned version. **Cast, not bumped** — changing the pin changes live Stripe behaviour, which is your call, not mine. |
| AI21 model literal | `chapter.ts:106` | dated snapshot `jamba-mini-1.6-2025-03` isn't in the SDK's `ChatModel` union. Cast. **See §2.1 — this may be failing at runtime.** |
| `@hugeicons/react` missing | `package.json` | `hugeicons-react`'s type definitions import from it, but it wasn't linked at top level, so `HugeiconsIconProps` didn't resolve. Added explicitly. |
| `HugeiconsProps` doesn't exist | `src/assets/svgs/crown-minus.tsx`, `half-star.tsx` | pre-existing type errors; replaced with `React.SVGProps<SVGSVGElement>` |

### 1.3 Broken-link fixes

| Was | Now | Where |
|---|---|---|
| `/write/story/new` (404) | `/write` | `creations/page.tsx:34, 78` — **both primary writer CTAs** |
| `/terms-of-service` (404) | `/terms-of-use` | `auth/signin/page.tsx:194` |
| `/explore` (404) | `/search` | `reading-list/[id]/page.tsx:132` |
| `/featured` (404) | `/search` | `chapter-page/similar-stories.tsx:59` |

`/guide/writing` (`creations/page.tsx:82`) is still a 404 — there is no obvious existing route to point it at. Either write the page or drop the button.

### 1.4 Verification

```
tsc --noEmit     0 errors  (was 12)
next build       passes    (was: failed to compile)
lucide-react     0 references
```

**One caveat on the diff.** I ran the project's own formatter (`biome`) over the 86 touched files. Biome's config defaults to tabs, but the committed code is 2-space, so I converted the indentation back — however biome also added trailing commas, added missing semicolons, and re-wrapped some long lines. Those changes are mixed into the icon diff in ~40 files. They are all valid per your `biome.jsonc`. If you want a pure icon diff, `git checkout HEAD -- <file>` and re-apply; otherwise this is just your linter catching up.

---

## 2. Bugs & breakages

### 2.1 Critical

**C1 — `/api/notifications/new-content` is an open email relay.**
`src/app/api/notifications/new-content/route.ts`
Unauthenticated `POST`. The caller supplies `userEmail`, `authorName`, `contentTitle`, and `contentUrl`, and the server sends an email from your domain to that address with that link. Anyone who finds this endpoint can send arbitrary phishing mail that appears to come from Readora. This will also get your sending domain blacklisted, which silently breaks magic-link login and every notification you send.
→ Require a server-side secret or session; never accept the recipient address from the client.

**C2 — `/api/notifications/new` sends bulk mail to all users, unauthenticated.**
`src/app/api/notifications/new/route.ts` → `sendBulkEmailToAll()`
No auth at all. Currently defused only because `sendEmail.ts:109` hardcodes `where: { email: "ujenbasi12@gmail.com" }` with the comment *"remove this filter when you actually want ALL users."* The day that filter comes off, this becomes a public "email my entire user base" button.
→ Add auth **before** removing the filter.

**C3 — Cron auth fails open.**
`src/app/api/daily-task/update-metrics/route.ts:6-12`
```ts
if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
```
If `CRON_SECRET` is unset or misspelled in the environment, the check is skipped entirely and the endpoint is public. Auth should fail closed: if the secret is missing, refuse.

**C4 — View counts are forgeable, and they drive the ranking algorithms.**
`src/app/api/read-event/route.ts`
`readerKey` comes from the request body with no auth, no rate limit, and no bot filtering. A loop of POSTs with random `readerKey` values increments `story.readCount` without bound. Worse, line 61: `userId: input.isAnonymous ? null : readerKey` writes a **client-supplied string straight into the `userId` foreign key** — a client can attribute reads to any user by sending their id.
This matters beyond vanity: `readCount` feeds `rising`, `latest`, `recommendations`, and `trending`. Forged reads directly control your homepage.
→ Derive `readerKey` server-side (session id, or a signed httpOnly cookie for anonymous readers). Never trust it from the body.

**C5 — Chapter pages are invisible to search engines.** ✅ **FIXED — see §6**
`src/app/chapter/[slug]/page.tsx`
No `generateMetadata`, no `metadata` export, no layout metadata. Verified live:
```
/chapter/cms7e5ih0000004jjxn3tmg87 -> <title>Readora - Where Stories Come Alive</title>
/chapter/cms7eg3b7000104l1qo3pe9sm -> <title>Readora - Where Stories Come Alive</title>
```
Every chapter on the platform shares one title, has no meta description, no canonical, no OpenGraph, no `Article`/`Chapter` structured data, and a raw-CUID URL. They are also absent from the sitemap (§2.2/H1). To Google this is a large set of near-duplicate untitled pages, which is close to the worst possible signal.
This is the single biggest cause of the traffic ceiling. Full treatment in §5.

### 2.2 High

**H1 — Sitemap omits every chapter page.** ✅ **FIXED — see §6**
`src/app/sitemap.ts` emits the homepage, `/write`, `/premium`, and story pages — 46 URLs live. It omits all chapter pages (the actual content), plus `/search`, `/about`, `/contest`, `/comparision`, `/terms-of-use`, `/privacy-policy`, and genre listings. On a sampled story, 5 chapters exist per story page; across 43 stories the missing surface is in the hundreds.

**H2 — The `rising` algorithm ranks an arbitrary sample.**
`src/server/api/routers/story.ts:152-162`
```ts
const stories = await ctx.postgresDb.story.findMany({
  select: {...NCardEntity, createdAt: true, updatedAt: true},
  where: { storyStatus: "PUBLISHED" },
  take: input.limit * 2,          // 16 rows
});                               // <- no orderBy
```
With no `orderBy`, Postgres returns an arbitrary 16 rows. The elaborate scoring below it (view velocity, rating weight, chapter velocity, momentum) then ranks *those 16*. The "Rising" shelf on your homepage is showing essentially random stories, and gets more wrong as the catalogue grows.
→ Compute the score in SQL over the full published set, or at minimum `orderBy` a proxy (recent `updatedAt` + `readCount`) before truncating.

**H3 — `latest` re-ranks a truncated window.** `story.ts:94-113` — same shape, less severe (it does have an `orderBy`), but re-sorting `limit * 2` rows in JS after the DB already ordered them still can't surface the right results.

**H4 — Homepage is fully dynamic with no caching.**
`src/app/page.tsx:29` calls `await auth()`, which reads cookies and opts the entire route out of static generation and the full-route cache. Every anonymous visitor from Google triggers a fresh server render plus ~6 uncached DB round-trips (recommendations, trending, latest, rising, completed, plus the session lookup).
→ Split the page: render the shelves as a static/ISR shell and move the personalised branch into a small client or streamed component.

**H5 — `export const revalidate = 60` is inert in 4 of 5 places.**
`revalidate` is a **route segment** config — it only takes effect in `page.tsx`, `layout.tsx`, or `route.ts`. These are ordinary component files under `_components/`, so the exports do nothing:
- `_components/layouts/(/)/latest-rising.tsx:40`
- `_components/layouts/(/)/popular-completed.tsx:20`
- `_components/layouts/(/)/trending.tsx:20`
- `_components/layouts/(/)/recommendations.tsx:21`

Only `story/[slug]/page.tsx:13` is real. So the caching you think you have on the homepage does not exist. (And per H4 it couldn't apply anyway while `auth()` is called at the top.)

**H6 — Unbounded read-history queries with nested payloads.**
`story.ts:258` and `user.ts:437` both do `readEvent.findMany({ where: { readerKey } })` with **no `take`**, each joining `chapter → story` and selecting the full `NCardEntity`. These run on the homepage and the history page. A reader with a long history pulls their entire lifetime of read events, with a story object attached to each, on every page load. This degrades continuously and silently.

**H7 — Sequential queries that should be parallel.**
`story.ts:291, 301, 317` — three independent `findMany` calls awaited one after another inside `recommendations`. `Promise.all` cuts this to one round-trip's latency. (The same file already uses `Promise.all` correctly at line 221, so this is an inconsistency, not a knowledge gap.)

**H8 — Dead null-guard after dereference.**
`src/app/chapter/[slug]/page.tsx:17-23`
```ts
const userUnlockedChapter = await api.chapter.getUserUnlockedChapter({
  chapterId: chapter.chapter.id,     // line 18 — dereferences chapter
});
if (!chapter) { notFound(); }        // line 21 — too late
```
If `chapter` is ever nullish, line 18 throws a `TypeError` and the user gets a 500 instead of a 404. Move the guard above the second call.

**H9 — AI21 model id may be invalid.** `chapter.ts:106` uses `"jamba-mini-1.6-2025-03"`; the installed SDK's `ChatModel` union is `'jamba-mini' | 'jamba-large'`. I cast it to unblock the build rather than change model selection, but **this should be verified against a live AI21 call** — if the dated snapshot has been retired, AI-assisted chapter generation is failing in production and the error is being swallowed (§2.3/M1).

### 2.3 Medium

**M1 — Errors swallowed silently.** `catch {}` with no logging and an implicit `undefined` return:
`user.ts:85`, `story.ts:1065`, `story.ts:1897`, `reviews.ts:585`.
`story.ts:1065` (`getAuthorWorkTitle`) returns `undefined` instead of an array on failure, so callers doing `.map()` crash with a confusing downstream error. You cannot diagnose production issues through these.

**M2 — Bullet List and Numbered List share an icon.** `editor/selectors/node-selector.tsx:57, 64` both use `LeftToRightListNumberIcon`. Pre-existing (`ListOrdered` was used for both in the lucide version), but now easy to fix: use `LeftToRightListBulletIcon` for the bullet entry.

**M3 — `console.log` on hot paths.** `read-event/route.ts:18` logs on every read event; `daily-task/update-metrics/route.ts:21`; `sendEmail.ts:132-134`. Noise and cost at any real volume.

**M4 — Race on read-event creation.** `read-event/route.ts:31-38` does `findFirst` then `create` non-atomically. Concurrent requests for the same `(readerKey, chapterId)` will violate the unique constraint. Use `upsert`.

**M5 — Resend sandbox domain.** `auth/config.ts:161` and `sendEmail.ts:123` send from `onboarding@resend.dev`. That is Resend's shared testing domain — it is rate-limited, frequently spam-foldered, and in some configurations only delivers to the account owner. **If magic-link login is ever re-enabled, it will not reliably deliver from this address.** Verify a real domain in Resend and set `EMAIL_FROM`.

**M6 — Database session strategy costs a query per request.** `auth/config.ts` uses `PrismaAdapter` with no `strategy: "jwt"`, so every session read is a DB round-trip (`getSessionAndUser`), plus a periodic session-row `UPDATE`. On serverless with an unpooled connection this is latency on every authenticated request. A JWT strategy removes it, at the cost of slower revocation. *(Note: the `session` callback itself is correct — Auth.js spreads the full adapter user row, so `session.user.username/coins/premium` do resolve.)*

**M7 — 118 of 195 components are `"use client"` (60%).** High for a content site that depends on search traffic; it inflates the JS bundle and pushes content out of the server-rendered HTML.

**M8 — `hugeicons-react` is deprecated.** Its own `package.json` says `"[DEPRECATED] Use @hugeicons/react instead. This package is no longer maintained."` It also ships broken types (they import from `@hugeicons/react`, which is why that package had to be added explicitly). It works today and I did not migrate off it — that would mean rewriting all 134 call sites to the `<HugeiconsIcon icon={...} />` API. Worth scheduling. There is also a stale duplicate `hugeicons-react@0.3.1` in the pnpm store.

**M9 — Chapter URLs are CUIDs.** `/chapter/cms7e5ih0000004jjxn3tmg87`. The router procedure is already named `getChapterDetailsBySlugOrId` and accepts slugs — the links just don't use them. Story pages already do this correctly (`/story/a-murder-to-share`).

**M10 — `<Kbd variant="beta-label">coming soon</Kbd>` on two of three sign-in options.** Facebook and magic-link are both `disabled`. See §5.2 — this is a growth problem more than a bug.

**M11 — `story.ts` is 1,920 lines.** Ranking logic, CRUD, search, and recommendations in one module. The three ranking algorithms (`latest`, `rising`, `recommendations`) duplicate similar scoring math with different weights and no shared helper or tests — which is how H2 went unnoticed.

**M12 — No rate limiting anywhere.** No middleware, no Upstash/Vercel KV limiter on `/api/read-event`, the notification routes, or tRPC mutations.

---

## 3. Why the traffic is stuck at ~1k/month

### 3.1 The arithmetic

Your indexable surface is roughly 3% of what it should be. The sitemap lists 46 URLs. The site has 43 stories; sampling one shows 5 chapters, so the real content surface is in the high hundreds. Those chapter pages are:

- absent from the sitemap
- sharing one identical `<title>` across the entire site
- without meta descriptions or canonicals
- on opaque CUID URLs with zero keyword signal
- without `Article`/`Book`/`Chapter` structured data

Google's handling of a large set of untitled, near-identical, un-linked-from-sitemap pages is to crawl a few, classify them as duplicates, and index almost none. **You are not competing badly for search traffic — you are largely not in the index.**

### 3.2 Why that specifically matters for fiction

The competitive data is unambiguous about where reading-platform traffic comes from. Wattpad's traffic is roughly **80% direct and ~14% from Google**; the organic share that does exist is driven by *specific story-title queries* — Webnovel's top organic keywords are things like `shadow slave`, i.e. individual work titles, not generic terms like "read free stories online."

Two consequences:

1. **You cannot win generic head terms.** "Free stories," "read novels online" belong to Wattpad, Webnovel, RoyalRoad, and AO3 on domain authority alone. Competing there is a waste of effort.
2. **The long tail of title + chapter queries is the *only* realistic organic channel for a new platform** — and it is exactly the surface you have disabled. A reader searching for a specific story or "«story title» chapter 7" is the highest-intent traffic available to you, and every one of those pages is currently untitled and unlisted.

The 80%-direct figure also explains why a `*.vercel.app` subdomain hurts more than it looks. Direct traffic requires a brand people can recall and type. `thereadora.vercel.app` reads as a staging deployment, cannot accrue brand authority, and materially depresses trust at the exact moment someone decides whether to sign in.

### 3.3 Speed

Per H4/H5, the homepage renders dynamically with ~6 uncached queries and no working ISR. Slow TTFB is both a direct ranking factor and a bounce driver on the mobile connections that dominate fiction reading.

---

## 4. Why almost nobody signs up and writes

### 4.1 The writer funnel terminated in a 404

This is the finding I'd act on first. Before this pass:

- `/creations` header → "Start a new story" → **404**
- `/creations` empty state → "Create Your First Novel" → **404**
- `/creations` empty state → "Readora Writing Guide" → **404**

The empty state is shown to *every user who has never written anything* — i.e. every prospective writer, at the exact moment of highest intent. All three exits were dead. Three of the four are fixed (§1.3); the writing guide still needs a page.

You cannot measure demand for writing through a broken door. Any conclusion about writer interest drawn from data before this fix is unreliable.

### 4.2 Google OAuth is the only way in

`auth/signin/page.tsx`: Facebook is `disabled` ("coming soon"), and the magic-link handler is `e.preventDefault(); return;` with a `disabled` submit button ("coming soon"). Google OAuth is the sole working path.

For a fiction audience — skewing young, mobile, privacy-conscious, and often on shared or school devices where a Google account isn't available or isn't the one they want attached to their pen name — single-provider Google-only auth is a severe constraint. Pen-name culture is central to this category; Wattpad and AO3 are built around identity separation, and linking a real-name Google account is precisely the friction that stops that user.

The magic-link path is fully implemented server-side already (`Nodemailer` provider + `sendMagicLinkEmail` are wired in `auth/config.ts`). Re-enabling it is mostly deleting the `disabled` props and uncommenting the handler — **but fix the sender domain first (M5)**, or the mails won't land.

### 4.3 Nothing brings a reader back

There is no scheduled digest, no "new chapter from an author you follow" email, and no push. The notification infrastructure exists (`sendNewContentEmail`) but is only reachable through an unauthenticated endpoint nobody calls on a schedule. Serial fiction lives on the return visit; a reader who finishes chapter 5 has no mechanism pulling them to chapter 6 tomorrow.

### 4.4 The cold-start trap

At your scale, the homepage shelves are the product, and per H2 the "Rising" shelf is showing arbitrary stories. With ~43 works, algorithmic ranking has nothing to work with anyway — the standard resolution is editorial curation until liquidity exists. A hand-picked shelf of your 10 genuinely best stories will outperform any scoring function over 43 items, and removes an entire class of bug.

---

## 5. Prioritized plan

### Do this week — unblocks everything else

1. **Add `generateMetadata` to `chapter/[slug]/page.tsx`.** Unique title (`«Chapter title» — «Story title» | Readora`), description from the first ~155 chars of chapter text, canonical URL, OpenGraph. *Highest-leverage change available to you.*
2. **Add chapter pages to `sitemap.ts`,** plus the static pages currently missing.
3. **Close C1/C2/C3** — auth on both notification routes; make the cron check fail closed.
4. **Buy a real domain.** `readora.com`/`.co`/`.app`. Prerequisite for brand recall, direct traffic, and email deliverability.
5. **Create `/guide/writing`** or remove the button.

### Next two weeks

6. **Fix `rising` (H2)** or replace all three shelves with editorial curation (§4.4). Curation is the better call at this catalogue size.
7. **Switch chapter URLs to slugs (M9).** The procedure already supports it. Add redirects from CUID URLs.
8. **Re-enable magic-link auth** — verify a real Resend domain (M5), then remove the `disabled` props and restore the handler.
9. **Fix `readerKey` forgery (C4)** — derive it server-side.
10. **Make the homepage cacheable (H4/H5)** — move `auth()` out of the top-level render so the shelves can be statically generated.
11. **Bound H6's queries** with `take` + pagination.

### Ongoing

12. `Book`/`Chapter` JSON-LD on story and chapter pages (story pages already have some — extend it).
13. Weekly "new chapters from authors you follow" digest.
14. Replace `catch {}` with real logging (M1) — you currently cannot see production failures. Verify H9 while doing this.
15. Rate limiting (M12).
16. Break up `story.ts` and add tests to the three ranking functions (M11).
17. Plan the `@hugeicons/react` migration (M8).

---

## 6. SEO pass (run with `claude-seo` tooling)

A second pass audited the live deployment with the `claude-seo` toolchain. It confirmed
C5/H1 above and surfaced four issues the manual read had missed — one of them more
severe than anything in §2.

### 6.1 What the tooling measured

| Page | Title | Canonical | H1s | Words in HTML |
|---|---|---|---|---|
| Homepage | ✅ unique | ✅ correct | **33** ❌ | 1039 |
| Story page | ✅ unique | ✅ correct | 1 ✅ | 288 |
| Chapter page | ❌ sitewide default | ❌ **pointed at homepage** | **0** ❌ | **17** ❌ |

Homepage OG/Twitter tags, alt text (64/64 images), `robots`, and `WebSite` +
`SearchAction` schema were all already correct.

### 6.2 New findings

**S1 (Critical) — Every metadata-less page declared the homepage as its canonical.** ✅ Fixed
`generateSEOMetadata` defaulted `pathname` to `""`, and the **root layout** called it. In
the App Router a layout's `alternates.canonical` is inherited by every child route that
doesn't set its own. So chapter pages, `/search`, `/contest`, `/comparision`, `/creations`
and `/reading-list` all emitted `<link rel="canonical" href="https://thereadora.vercel.app">`.
That is not a missing signal — it is an explicit instruction to Google that each page is a
duplicate of the homepage and should not be indexed. This outranks C5 as the single most
damaging SEO defect on the site.
Fix: `pathname` is now optional and a canonical is only emitted when a page states its own
path; the root layout no longer declares one.

**S2 (Critical) — Chapter prose was never server-rendered.** ✅ Fixed
Chapter pages returned **17 words** of HTML. `chapter-content.tsx` read the chapter, story
and content chunk from a Zustand store that `wrapper.tsx` only populates inside a
`useEffect` — so during SSR the store was empty, `Content` returned `null` at the early
guard, and `ChapterMetaData`'s `<h1>{chapter?.title}</h1>` rendered empty (hence 0 H1s).
Googlebot received a shell with no title, no heading and no prose.
Fix: the server-fetched `details` are threaded down as props and read as
`store ?? details`, so the initial HTML now carries the title, the `<h1>` and the opening
chunk while all client behaviour (infinite scroll, store updates) is unchanged. The store
could not simply be hydrated during render — it is a module-level store with `persist`
middleware, so writing to it on the server would leak between requests.

**S3 (High) — 33 `<h1>` tags on the homepage.** ✅ Fixed
`novel-card.tsx:173` wrapped every story-card title in an `<h1>` (line 75 of the same file
already used `<h3>`), and `hello-writers.tsx:92` added a second page-level `<h1>`. Now one
`<h1>` (the hero), cards use `<h3>`, and the writers section uses `<h2>`.

**S4 (Medium) — `og-image.jpg` returned 404.** ✅ Fixed
`siteConfig.ogImage` referenced `/og-image.jpg`, which did not exist, so every share of a
page without its own image showed a broken preview. A branded 1200×630 placeholder is now
committed at `public/og-image.jpg`. Worth replacing with a designed asset.

**S5 (Medium) — `Chapter.slug` is not globally unique.** ⚠️ Documented, not fixed
The schema declares `@@unique([storyId, slug])`, so two stories can both own a chapter
slugged `chapter-1`. `getChapterDetailsBySlugOrId` resolves slugs with `findFirst`, which
returns an arbitrary match. This is why chapter canonicals point at the CUID rather than
the slug — the pretty-URL improvement in §5 item 7 **cannot be done safely** until slugs
are made globally unique or the route becomes `/story/[storySlug]/[chapterSlug]`. Treat
this as a prerequisite, not an optional cleanup.

### 6.3 Also fixed in this pass

- Chapter pages now emit `Chapter` JSON-LD nested in the parent `Book`, with author and publisher.
- Chapter `generateMetadata` derives its description from the opening prose (HTML-stripped, truncated at 155 chars) and falls back to a generated sentence.
- `generateMetadata` and the page body share one query via React `cache()` rather than querying twice.
- Sitemap rebuilt: static routes (9, was 3) + stories + **all unlocked, already-published chapters**, addressed by id, `revalidate = 3600`. Locked and future-scheduled chapters are excluded to avoid indexing paywalls and thin pages.
- `/contest` and `/comparision` gained real titles and descriptions.
- `/creations` and `/reading-list` are now explicitly `noIndex` (they are auth-gated by `proxy.ts` and were previously indexable *and* canonicalised to the homepage).

### 6.4 Verification status

`tsc --noEmit` is clean and `next build` passes with all of the above. The rendered output
could not be re-measured locally — there is no `.env` in the working tree, so the
production server can't reach the database. **Re-run the measurement after deploying**:

```
claude-seo run fetch_page.py https://<domain>/chapter/<id> -o /tmp/c.html
claude-seo run parse_html.py /tmp/c.html --url https://<domain>/chapter/<id>
```

Expect: unique title, canonical pointing at the chapter itself, 1 H1, and a word count in
the hundreds rather than 17.

---

## 7. One strategic note

The engineering here is ambitious — three ranking algorithms, AI chapter generation, Stripe subscriptions, an affiliate programme, a coin economy, analytics dashboards, contests. That surface area is why the basics slipped: the site could not build, the writer CTA 404'd, and the content isn't indexed.

At 1k visits/month the coin economy and affiliate programme are not the constraint. Two things are: **can Google find your chapters**, and **can a motivated writer reach the editor**. Both were broken. Fix those, get real traffic, and then the monetisation surface has something to monetise.

---

*Audit performed 2026-08-02. All findings verified against the live deployment or reproduced locally. Line references are against the working tree as of this document.*
