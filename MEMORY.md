# Project memory — luitiescobar.com

Living log of what has been built, where everything lives and what's pending.
**Update this file at every milestone** (new page/feature, deploy, CMS change, decision).
Last update: 2026-10-16

---

## 1. What this is

Multidisciplinary portfolio for Luiti Escobar (Valencia, Spain): Graphic Design, Motion Design, AI Media and 3D.
Bilingual EN (`/`) and ES (`/es/`), switchable in the header. Minimal light palette with blurred gradient
blobs, glass "lens" circles and geometric patterns (zigzag, dot grid, line triangles).

- Domain: `luitiescobar.com` (Cloudflare). Studio planned at `cms.luitiescobar.com`.
- Sanity: org `luitiescobar` (`oasl4bj9d`), project **`cp45bc1k`**, dataset `production` (public read).
  Login via the user's GitHub account. Manage at https://www.sanity.io/manage
- Cloudflare account: (see MEMORY.private.md) (`<account-id>`); wrangler is logged in on this machine.
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
wrangler.jsonc      site Worker config (D1 binding, custom domains)
```

## 4. Content model (Sanity)

- **project**: title (EN/ES), slug, coverImage (required, alt), discipline, subcategory, date, `selected`
  (Home "Selected work"), `featured` (Home discipline card), client, year, role, tools, lead, body
  (rich text: headings, bold/italic, lists, quotes, links, images, image rows), gallery.
- **siteSettings** (singleton): Home copy (hero, bio paragraphs), About (role, lead, experience list,
  tools, training, languages), Contact (email, location, availability, titles, socials), per-discipline
  description/tags/reel URL, SEO defaults. Empty fields fall back to the defaults in code.
- Reel video: Vimeo/YouTube link or external mp4 — **never upload video files to Sanity** (bandwidth cost).

How the site uses it: `src/lib/cms.ts` fetches everything once per build. If `PUBLIC_SANITY_PROJECT_ID`
is unset, or no project is published yet, the placeholder data in `src/data/` is used.
Publishing in Sanity requires a **rebuild + deploy** of the site (webhook automation still pending).

## 5. Likes

- `GET /api/likes?slugs=a,b` → counts + which ones this visitor liked. `POST /api/likes {slug, liked}`.
- One like per visitor per project: salted SHA-256 of IP + user agent (no personal data stored).
- Optional secret `LIKES_SALT` (`npx wrangler secret put LIKES_SALT`).
- D1 id `c9b2180e-c9e1-4c22-b3fd-65a4e78272a3` (region WEUR); table `likes` already created remotely.
- Local: `npx wrangler d1 migrations apply luitiescobar-likes --local`, then `npm run build && npm run preview`.

## 6. Commands

```
npm run dev                      # site dev server
npm run build && npm run preview # production build, runs on workerd locally (API + D1 local)
npx astro check                  # type-check
npx wrangler deploy              # deploy site (after build)
cd studio && npm run dev         # Studio locally (needs studio/.env)
cd studio && npm run deploy:cf   # build + deploy Studio to cms.luitiescobar.com
cd studio && npx sanity exec scripts/seedSettings.ts --with-user-token   # create Site settings if missing
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
- Contact form opens a pre-filled email (mailto) until a real form backend exists.

## 8. Milestones

- [x] Figma mockups desktop (Home, Gallery, Project) + mobile (Home, Gallery) — user reviewed/edited
- [x] Home (EN/ES) — commit a6e512e
- [x] Discipline section pages with filters, sorting, reel — e46dd9d
- [x] Project case-study pages with like/share — 4b91fc4
- [x] About + Contact with real CV data — 67a835e, 3f424c5
- [x] Sanity Studio schemas + site data layer + likes API/D1 (tested locally)
- [x] Sanity project `cp45bc1k` created, `.env` files written, CORS (localhost:3333, cms.luitiescobar.com),
      "Site settings" seeded from the code defaults (`studio/scripts/seedSettings.ts`, never overwrites)
- [ ] Deploy site to Cloudflare (`luitiescobar.com`) and Studio (`cms.luitiescobar.com`)
- [ ] Migrate real content into Sanity (projects, covers, case studies)
- [ ] Rebuild on publish (Sanity webhook → GitHub Action / Cloudflare build)
- [ ] Contact form backend (Worker + email service)
- [ ] Reel video URL for Motion Design
- [ ] SEO polish: OG images, sitemap
