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

In production the same proxy contract applies — the API server and the static frontend should be deployed together (e.g. behind a reverse proxy, or by having the API server serve the built `dist/public/` of blaze-studio).

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
