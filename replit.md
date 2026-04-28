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

## Blaze Studio (artifact)

Multi-page React + Vite site using `wouter` for routing. Routes:

- `/` Home — Hero, Stats, Brands, Why Us, CTA
- `/about` — Story, values, team, milestones
- `/services` — Services + Process
- `/portfolio` — Portfolio
- `/testimonials` — Testimonials
- `/contact` — Problem, Contact form, FAQ

Shared layout in `src/components/layout/site-layout.tsx` wraps every page with the navbar, footer, sticky CTA, WhatsApp float, live notifications, and exit-intent popup. Cross-page navigation (with optional anchor scroll) goes through the `useNav` hook in `src/hooks/use-nav.ts`.
