# Project memory — luitiescobar.com

Living log of what has been built, where everything lives and what's pending.
**Update this file at every milestone** (new page/feature, deploy, CMS change, decision).
Last update: 2026-10-22 (auto-rebuild on publish live)

---

## 1. What this is

Multidisciplinary portfolio for Luiti Escobar (Valencia, Spain): Graphic Design, Motion Design, AI Media and 3D.
Bilingual EN (`/`) and ES (`/es/`), switchable in the header. Minimal light palette with blurred gradient
blobs, glass "lens" circles and geometric patterns (zigzag, dot grid, line triangles).

- **Live:** https://luitiescobar.com and https://www.luitiescobar.com (Worker `luitiescobar`, custom domains) since 2026-10-17.
  Also on the workers.dev preview (URL in MEMORY.private.md). The old site is still the Cloudflare Pages project
  `luitiescobar` at https://luitiescobar.pages.dev (domain removed from it) — rollback only.
- Studio (live): https://cms.luitiescobar.com (Worker `luitiescobar-cms`, Sanity login with GitHub)
- Sanity: org `luitiescobar` (`oasl4bj9d`), project **`cp45bc1k`**, dataset `production` (public read).
  Login via the user's GitHub account. Manage at https://www.sanity.io/manage
- Cloudflare account: details in MEMORY.private.md (git-ignored); wrangler is logged in on this machine.
- **The repo is public (since 2026-10-20).** Personal or account details go in MEMORY.private.md, never here.
- Repo: https://github.com/leimagen/luitiescobar-portfolio-2026 (private, branch `main`)
- Figma: https://www.figma.com/design/LobZm66SS0X4WfSUlcQFLd/luitiescobar-portfolio-2026 (page "Mockups")

## 2. Stack

| Piece | Choice |
|---|---|
| Site | Astro 7, static prerender, `@astrojs/cloudflare` adapter (Workers + static assets) |
| CMS | Sanity v6 Studio in `studio/` (separate npm package), field-level EN/ES |
| Likes | `/api/likes` on the Worker + Cloudflare D1 `luitiescobar-likes` |
| Fonts | Outfit (200–500) + JetBrains Mono, self-hosted via `@fontsource` |
| Images | Local: Astro `<Image>` (sharp at build). CMS: Sanity image CDN (`src/lib/sanity.ts`) |

## 3. Where things are

```
src/
  pages/            index, [section] (4 disciplines), work/[slug], about, contact; es/ mirrors; api/likes.ts
  views/            Home, Section, Project, About, Contact (page bodies shared by EN/ES routes)
  components/       Nav, Footer, Hero, Disciplines/DisciplineCard, MasonryGrid/ProjectCard, Reel,
                    RichBody (+ pt/ for Portable Text images), ProjectActions (like/share), CoverMedia,
                    Blob, Lens, DotGrid, ContactStrip, IntroTeaser
  data/             disciplines.ts, projects.ts, caseStudies.ts, site.ts — placeholders + CMS overrides
  lib/              sanity.ts (client, image URLs), cms.ts (one GROQ fetch at build, top-level await)
  i18n/             ui.ts (all UI strings EN/ES), utils.ts (t(), localizePath; CMS overrides some keys)
  scripts/likes.ts  browser helpers for /api/likes
  styles/global.css design tokens (mirror Figma "Tokens")
studio/             Sanity Studio: schemaTypes/{objects,documents}, sanity.config.ts, wrangler.jsonc (cms subdomain)
migrations/         D1 SQL migrations (0001_likes.sql)
design/             first static HTML mockups (reference only)
assets/             source files (profile-pic.psd — git-ignored)
wrangler.jsonc      site Worker config (D1 binding, custom domains luitiescobar.com + www)
```

## 4. Content model (Sanity)

- **project**: title (EN/ES), slug, coverImage (required, alt), discipline, subcategory, date, `selected`
  (Home "Selected work"), `featured` (Home discipline card), client, year, role, tools, lead, body
  (rich text: headings, bold/italic, lists, quotes, links, images, image rows), gallery.
- **siteSettings** (singleton): Home copy (hero, bio paragraphs), About (role, lead, experience list,
  tools, training, languages), Contact (email, location, availability, titles, socials), per-discipline
  description/tags/reel URL, SEO defaults. Empty fields fall back to the defaults in code.
- Reel / project video: Vimeo/YouTube link (unlisted `vimeo.com/ID/HASH` supported), external mp4, or a site path —
  **never upload video files to Sanity** (bandwidth cost). Projects have a `video` field shown on top of the case study,
  and rich text has a `videoEmbed` block (short mp4 = silent autoplay loop; respects reduced motion).
- Short clips are served by the site itself from `public/media/` (Workers static assets, ≤25 MiB/file; transcode with
  H.264 CRF 22, faststart, no audio). R2 is NOT enabled on the Cloudflare account (needs the user to enable it in the
  dashboard); use Vimeo or R2 for long videos like the reel.

How the site uses it: `src/lib/cms.ts` fetches everything once per build. If `PUBLIC_SANITY_PROJECT_ID`
is unset, or no project is published yet, the placeholder data in `src/data/` is used.
Publishing in Sanity rebuilds and redeploys the site automatically (webhook → Workers Builds, ~1-2 min).

## 5. Likes

- `GET /api/likes?slugs=a,b` → counts + which ones this visitor liked. `POST /api/likes {slug, liked}`.
- One like per visitor per project: salted SHA-256 of IP + user agent (no personal data stored).
- Secret `LIKES_SALT` is set on the Worker (random; rotate with `npx wrangler secret put LIKES_SALT`).
- D1 id `c9b2180e-c9e1-4c22-b3fd-65a4e78272a3` (region WEUR); table `likes` already created remotely.
- **Telegram notification on every new like** (`src/lib/notify.ts`, called from the POST with `cfContext.waitUntil`):
  project title (ES, fetched live from Sanity), total likes, approximate city/country (request.cf), device + browser
  (user agent), external referrer host sent by the browser, link to the project. Once per visitor+project
  (table `like_notifications`, migration 0002) and max 30/hour. Needs Worker secrets `TELEGRAM_BOT_TOKEN`
  (@BotFather) and `TELEGRAM_CHAT_ID`; without them it does nothing. **Live and verified 2026-10-17** (both secrets
  set; on Windows the user stores the token with `Get-Clipboard | npx wrangler secret put TELEGRAM_BOT_TOKEN`).
  The cookie policy mentions this notification (nothing stored).
- Local: `npx wrangler d1 migrations apply luitiescobar-likes --local`, then `npm run build && npm run preview`.

## 6. Commands

```
npm run dev                      # site dev server
npm run build && npm run preview # production build, runs on workerd locally (API + D1 local)
npx astro check                  # type-check
npx wrangler deploy              # deploy site (after build) → luitiescobar.com, www and workers.dev
cd studio && npm run dev         # Studio locally (needs studio/.env)
cd studio && npm run deploy:cf   # build + deploy Studio to cms.luitiescobar.com
cd studio && npx sanity exec scripts/seedSettings.ts --with-user-token   # create Site settings if missing
cd studio && npx sanity exec scripts/snapshot.ts --with-user-token        # dump drafts → ../.cms-snapshot.json
cd studio && npx sanity exec scripts/publishDrafts.ts --with-user-token   # publish every project draft at once
CMS_SNAPSHOT=.cms-snapshot.json npm run build && npm run preview         # preview drafts locally (never deploy this build)
```

Env (git-ignored, copies in `.env.example`): root `.env` → `PUBLIC_SANITY_PROJECT_ID=cp45bc1k`,
`PUBLIC_SANITY_DATASET=production`. `studio/.env` → `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`.
Default copy lives in pure modules `src/data/siteDefaults.ts` and `src/data/disciplineDefaults.ts`.

## 7. Decisions worth remembering

- Intro copy keeps **"over 15 years"** of experience (user's choice), even though the CV goes back to 2005.
- Contact email `info@luitiescobar.com`; socials only LinkedIn + Behance (no Instagram/Vimeo yet). Phone is not published.
- Header: 48px logo, 142px tall with equal air above/below, compacts to 76px on scroll (fixed, not sticky).
- Hero title font size scales to the longest line so each language fits the column.
- Masonry deals cards left-to-right into the shortest column (CSS columns as no-JS fallback).
- Appreciate block (Behance-style) was removed by the user; only the like button remains.
- Contact form → `POST /api/contact` (src/pages/api/contact.ts): emails the message through the Email Service
  binding `EMAIL` (from web@luitiescobar.com, reply-to the visitor) to the Worker secret `CONTACT_TO` (must be a
  verified Email Routing destination; info@ is forwarded to the same inbox), and pings Telegram. Honeypot field,
  3 s minimum on the page and 5 messages/hour per anonymous visitor hash (table `contact_rate`, migration 0003).
  If the API fails, the form falls back to a pre-filled mailto. Nothing from the message is stored.
- www.luitiescobar.com is served by the tiny Worker `luitiescobar-www` (workers/www-redirect): 301 to the apex,
  keeping path and query. Deploy it with `npx wrangler deploy --config workers/www-redirect/wrangler.jsonc`.
- **No em dashes ("—") in any user-facing text** (user: it reads as AI-written). Prose uses commas/colons/periods/
  parentheses; project titles use " - " ("Samsung - Galaxy Watch4 ..."); page titles end in " | Luiti Escobar".
  All Sanity content, code defaults, manifest and scripts were cleaned on 2026-10-17. Check new content for it.
- **Always `rm -rf dist` before `astro build`** for a deploy: the Cloudflare adapter does not clean `dist/client`,
  and stale placeholder pages (aero-chair, …) got deployed once. Stop the local preview first (it locks dist/).
- Share previews: BaseLayout emits Open Graph + Twitter tags. Default image `public/og-default(-es).jpg` (1200×630
  capture of the hero, made with headless Edge); project pages use their cover cropped to 1200×630 by Sanity
  (`ogImageUrl` in src/lib/sanity.ts). LinkedIn caches previews: refresh with https://www.linkedin.com/post-inspector/
- Analytics/SEO (ported from the old site's index.html, github.com/leimagen/luitiescobar): Google Analytics 4
  **G-J1EW2HGLJB** (`src/lib/seo.ts`, production builds only, **loaded only after consent**, see below),
  meta author/keywords, schema.org JSON-LD (Person + WebSite on every page, CreativeWork + VideoObject on projects),
  hreflang incl. x-default (VideoObject `uploadDate` must be a full datetime with timezone; mp4 → contentUrl,
  Vimeo/YouTube → embedUrl: fixed 2026-10-21 after a Search Console warning), `/sitemap.xml` (src/pages/sitemap.xml.ts, EN+ES with alternates), `public/robots.txt`.
  Search Console: submit https://luitiescobar.com/sitemap.xml there (not done by Claude; needs the user's Google login).
- Cookie consent (GDPR/AEPD): `src/components/CookieConsent.astro` (in BaseLayout). GA4 is injected only after
  "Accept"; "Reject" has the same weight; choice in localStorage `consent:analytics`; rejecting later deletes the
  _ga cookies. Any `[data-cookie-settings]` element reopens it (footer "Cookie settings", policy page button).
  Policy page /cookies + /es/cookies (`src/views/Cookies.astro`; lists _ga, _ga_J1EW2HGLJB, local storage keys).
  Vimeo (dnt=1) and YouTube (nocookie) embeds load only on play, so they need no consent.
- Favicon: "le" in Outfit (l 500 / e 300, from the logo font) light on an ink rounded tile: public/favicon.svg,
  favicon.ico (16/32/48), apple-touch-icon.png (180).

## 8. Milestones

- [x] Figma mockups desktop (Home, Gallery, Project) + mobile (Home, Gallery) — user reviewed/edited
- [x] Home (EN/ES) — commit a6e512e
- [x] Discipline section pages with filters, sorting, reel — e46dd9d
- [x] Project case-study pages with like/share — 4b91fc4
- [x] About + Contact with real CV data — 67a835e, 3f424c5
- [x] Sanity Studio schemas + site data layer + likes API/D1 (tested locally)
- [x] Sanity project `cp45bc1k` created, `.env` files written, CORS (localhost:3333, cms.luitiescobar.com),
      "Site settings" seeded from the code defaults (`studio/scripts/seedSettings.ts`, never overwrites)
- [x] Studio deployed to cms.luitiescobar.com; site deployed to the workers.dev preview; likes verified in production
- [x] **Go-live 2026-10-17** (user's go-ahead): all 38 drafts published (`studio/scripts/publishDrafts.ts`), routes enabled,
      deployed to luitiescobar.com + www. Needed the user to remove the domain from the old Pages project first
      (Cloudflare refuses custom domains whose DNS record is managed by Pages, error 100117).
- [x] Legacy content imported as Sanity **drafts** (35 projects: 17 Graphic Design, 14 Motion, 4 3D) from Behance
      (behance.net/luiti2D, originals via CDN `source`) + previous site repo (github.com/leimagen/luitiescobar, Vimeo pieces).
      Curated list + bilingual copy: `studio/scripts/legacy/manifest.json`; importer `importLegacy.ts` (skips existing slugs).
      Dates for re-uploaded Vimeo pieces (2026-03-xx) are placeholders — user to confirm.
- [x] Drafts published (user chose to publish all at once; can still edit in the Studio — each change needs rebuild + deploy)
- Dropped by the user: Digicel "Multiplicamos x 10" / "Menos plástico" and Sheraton Bijao (videos only on Behance's player)
- [x] AI Media #1 "From Illustration to AI Cinematic Shot" (draft): 4 Kling AI 3.0 Omni clips from the user's own
      illustrations (Ninja 2062, Fallen Angel, Stealther, Fantasy Mage), from the LinkedIn article
      linkedin.com/pulse/from-illustration-ai-cinematic-shot-article-luiti-escobar-wrkte. Script: studio/scripts/ai/illustrationToAi.ts
- [x] AI Media #2 "Telmedia Device — Generative AI short" (draft): 15s Kling AI short with audio from the user's Blender
      model (/media/ai/telmedia-device-short.mp4), reference frames + renders strip, from the LinkedIn article
      es.linkedin.com/pulse/telmedia-device-generative-ai-short-luiti-escobar-biqce. Script: studio/scripts/ai/telmediaShort.ts
- [x] AI Media #3 "Nómada Sur — 'Sangre Real' AI teaser" (draft): 24s teaser with audio
      (/media/ai/nomada-sur-sangre-real-teaser.mp4) for the user's band, from the LinkedIn post
      urn:li:activity:7513900792102166528 (+ process in its comments). Script: studio/scripts/ai/sangreRealTeaser.ts — d1028ed.
      **Privacy rule:** individual character sheets of band members are NEVER published (identity cloning risk);
      only the band lineup reference (BANDA_lineup), element sheets and stills.
- AI Media section complete (3 projects). User suggested going live on luitiescobar.com after this one.
- [ ] 3D interior design project (next, user will send material)
- [ ] New motion reel (old Vimeo 1178811549 was taken down over music licensing) — Motion Design shows "Reel coming soon" until then
- [x] Rebuild on publish (2026-10-22): Cloudflare Workers Builds is connected to the GitHub repo (branch main,
      `npm run build` + `npx wrangler deploy`), so every push to main deploys. Publishing a `project` or
      `siteSettings` document fires the Sanity webhook "Rebuild luitiescobar.com" → Workers Builds Deploy Hook
      (created with studio/scripts/createDeployWebhook.ts; hook URL never committed). Verified end to end:
      webhook 200, new deployment ~1 min later. Manual `npx wrangler deploy` still works (clean dist first).
- [x] Contact form backend: email + Telegram, verified in production (2026-10-21)
- [ ] Reel video URL for Motion Design
- [x] Open Graph / Twitter share tags + images (2026-10-17)
- [x] Ninja 2062 short (23s, several Kling AI shots edited, with audio) added to "From Illustration to AI Cinematic Shot":
      header video + cover frame, paragraph in the Ninja section, Fantasy Mage loop moved into the body.
      /media/ai/ninja-2062-short.mp4, script studio/scripts/ai/ninjaShort.ts
- [x] Favicon, GA4, JSON-LD, sitemap, robots.txt (2026-10-17)
- [x] Cookie consent banner + cookie policy page (2026-10-17)
- [x] CV in EN and ES (2026-10-19): `cv/content.mjs` (bilingual content, richer than the site: bullets per role,
      phone) + `cv/build.mjs` (HTML in the site's style, printed to A4 PDF with headless Edge). `node cv/build.mjs`
      → cv/out/ (git-ignored): EN and ES, each with and without photo, 2 pages, single column (ATS-readable).
      When the About data changes in Sanity, update cv/content.mjs too (it is not synced automatically).
- [x] www → apex 301 redirect (2026-10-21)
- [ ] Confirm placeholder dates (2026-03-xx) of re-uploaded Vimeo pieces
