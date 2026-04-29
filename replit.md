# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Architecture: dual workflow

The app runs as two parallel processes:

- **Start application** (`PORT=21028`) — Vite dev server for `@workspace/blaze-studio` (the public site). Vite proxies `/api/*` to the API server (`API_SERVER_URL`, defaults to `http://localhost:8000`).
- **API server** (`PORT=8000`) — Express backend (`@workspace/api-server`) that owns all `/api` routes (health, contact submissions). Persists to Postgres via Drizzle (`@workspace/db`).

In production the **API server itself serves the built frontend**. When `NODE_ENV=production`, `artifacts/api-server/src/app.ts` mounts `artifacts/blaze-studio/dist/public/` as static files (override path with the `STATIC_DIR` env var) and falls through to `index.html` for unmatched non-API paths.

### Replit Deploy

Deployment is configured in `.replit`'s `[deployment]` block (managed via the deployment tool, never edit `.replit` by hand). Target is `autoscale`.

- **Build command** (runs once per deploy): `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/blaze-studio run build && pnpm --filter @workspace/api-server run build` — produces the hashed Vite bundle in `artifacts/blaze-studio/dist/public/` and the esbuild bundle in `artifacts/api-server/dist/index.mjs`. PORT and BASE_PATH are required by `vite.config.ts` at config-load time even for `vite build`.
- **Run command**: `NODE_ENV=production node --enable-source-maps artifacts/api-server/dist/index.mjs` — Replit autoscale provides PORT via env. Setting NODE_ENV inline guarantees production mode without depending on a Secrets-panel value.
- **What happens on click-Publish**: pnpm install → build command → `pnpm store prune` (postBuild) → run command. The autoscale container scales to zero between requests so cold starts are possible; the in-memory work in routes is minimal so first-byte stays fast.

### Asset caching strategy

- **Hashed assets** (`/assets/*`) — Vite content-hashes every JS, CSS, image, and the hero video files (because they live in `src/assets/hero/` and are imported through the asset graph, not in `public/`). The API server returns `Cache-Control: public, max-age=31536000, immutable` for everything under `/assets/*`, so browsers cache them for one full year and never revalidate. When a file changes, the hash changes, and the new URL forces a fresh download automatically.
- **HTML shell** (`index.html` and SPA fallback) — returned with `Cache-Control: no-cache` so every visit revalidates and immediately picks up the new hashed asset URLs after a deploy.
- **Other root-level static files** (favicon, logo, robots.txt) — moderate `max-age=1h` with ETag revalidation, since they are not content-hashed by Vite.
- **Range requests** — Express 5's `express.static` natively returns `Accept-Ranges: bytes` and serves `206 Partial Content`, so the hero video can start playing before it's fully downloaded.
- **gzip compression** — `compression()` middleware (production-only) shrinks every text response. Measured: HTML 1.6 KB → 0.9 KB (-46%), JS bundle 1.6 MB → 508 KB (-69%). The middleware auto-skips already-compressed media types (image, video, audio), so MP4/WebM/JPG bytes go through untouched.
- **Hero video preload** — `index.html` includes a `<link rel="preload" as="image">` for the static poster JPG (Vite rewrites the `/src/...` href to the hashed URL during build); the video itself relies on `<video preload="auto">` plus the JS-bundle import, which start the byte fetch as soon as the JS loads. Mobile (`<768px`) swaps the desktop sources for a lighter 720p mobile MP4 inside a `useEffect` before the browser begins decoding.

### Adding API endpoints

Follow the contract-first flow: edit `lib/api-spec/openapi.yaml`, then `pnpm --filter @workspace/api-spec run codegen`, then add a route handler in `artifacts/api-server/src/routes/`. Frontend uses the generated React Query hooks from `@workspace/api-client-react`.

### Database

`contact_submissions` table stores leads from the contact form (with a `status` column: `new` | `reviewed` | `responded`). Schema lives in `lib/db/src/schema/`. Push schema changes with `pnpm --filter @workspace/db run push`.

## Admin Console (`/admin`)

Password-protected internal tool for managing leads, with a dark sidebar layout.

- **Login**: `/admin/login`. Backed by `ADMIN_PASSWORD` (Replit secret) and signed session cookies (`ADMIN_SESSION_SECRET`, auto-generated, 12h TTL, HttpOnly).
- **Leads dashboard**: `/admin/leads`. Stats cards (total / new / today / this month), real-time search by name/email, status filter, date-range filter, sortable columns, pagination (10/25/50), inline status dropdown with color-coded badges, expand-row modal with full details, delete confirmation, CSV + PDF export, sonner toasts, loading skeletons, and an empty state.
- **Endpoints**: `POST/GET /api/admin/{login,logout,session}`, `GET/PATCH/DELETE /api/admin/leads[/:id]` — auth enforced by `requireAdmin` middleware in `artifacts/api-server/src/lib/admin-auth.ts`.
- **Blogs**: `/admin/blogs` (list with stats, search, status/category filters, sort, pagination, bulk publish/unpublish/delete), `/admin/blogs/new` and `/admin/blogs/edit/:id` (TipTap editor: H1–H4, bold/italic/underline, lists, blockquote, code, link, image upload as base64; auto-slug, featured image, excerpt, SEO collapsible with character counters, category select with inline create, tag chips, author, reading-time auto-calc, save draft / publish / schedule, autosave every 60s).
- **Categories**: `/admin/blogs/categories` — inline add (name + description), edit, delete with post-count warning.
- **Blog endpoints**: `GET/POST /api/admin/blog-posts`, `GET/PATCH/DELETE /api/admin/blog-posts/:id`, `POST /api/admin/blog-posts/bulk` (delete/publish/unpublish), `GET/POST /api/admin/blog-categories`, `PATCH/DELETE /api/admin/blog-categories/:id`. Server slugifies, dedupes slugs, computes reading time, and manages `publishedAt`/`scheduledAt` based on status. Tables `blog_posts` + `blog_categories` (FK with `set null` on category delete) live in `lib/db/src/schema/`.
- **Testimonials**: `/admin/testimonials` — list with stats (total/published/hidden/avg rating), search, status filter, create/edit dialog (client name, job title, company, domain → auto-fetched logo, optional logo override, profile photo upload as base64, quote, 1–5 star rating, industry, result label, published switch), reorder via up/down arrows, inline publish toggle, delete with confirm. Logos resolve via `https://logo.clearbit.com/{domain}` with company-initial badge fallback on error. `testimonials` table in `lib/db/src/schema/`. Endpoints: `GET /api/testimonials` (public, only published), `GET/POST /api/admin/testimonials`, `GET/PATCH/DELETE /api/admin/testimonials/:id`, `POST /api/admin/testimonials/reorder`.

### Public testimonials surface
- **Trusted-By bar** (`components/sections/trusted-by-bar.tsx`): auto-scrolling marquee of unique company logos, greyscale → color on hover, pauses on hover, respects `prefers-reduced-motion`.
- **Testimonials section** (`components/sections/testimonials.tsx`): 3-up grid (≤3 items) or auto-advancing carousel with prev/next + dot pagination (>3 items), native swipe on mobile, skeleton loader and graceful empty state.

## Blaze Studio (artifact)

Multi-page React + Vite site using `wouter` for routing. Routes:

- `/` Home — Hero, Stats, Brands, Why Us, CTA
- `/about` — Story, values, team, milestones
- `/services` — Services + Process
- `/portfolio` — Portfolio
- `/testimonials` — Testimonials
- `/blog` — Blaze Insights index (featured + filterable grid + newsletter)
- `/blog/:slug` — Long-form article detail with editorial polish: breadcrumbs, ARTICLE Nº kicker, drop-cap first paragraph, numbered H2 kickers (01., 02. with gradient line), Key Takeaways box, editorial cover (SVG grid + giant article number + tags), sticky numbered ToC + vertical share rail (desktop), gradient progress bar, polished author card, related grid, CTA
- `/contact` — Problem, Contact form, FAQ

Shared layout in `src/components/layout/site-layout.tsx` wraps every page with the navbar, footer, sticky CTA, WhatsApp float, live notifications, and exit-intent popup. Cross-page navigation (with optional anchor scroll) goes through the `useNav` hook in `src/hooks/use-nav.ts`.

Blog content lives in `src/lib/posts.ts` as a typed `POSTS` array of structured `Block`s (h2/h3/p/list/quote/callout/stats/divider). Blog focus: AI-integrated websites for businesses. Both `/blog` and `/blog/:slug` consume this single source.
