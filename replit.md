# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Project: StaxVibe AI Graphics

A premium dark-mode digital marketplace for selling high-end financial infographics and AI design templates. Trading dashboard aesthetic with neon green (#00FF88), electric red (#FF3366), and teal (#00E5CC) accents.

### Features
- **Product Grid**: Gallery of financial infographic packs, AI prompt libraries, faceless video assets, and Notion trading dashboards
- **Categories**: Financial Infographic Packs, AI Prompt Libraries, Faceless Video Assets, Notion Trading Dashboards
- **Stripe Checkout**: Creates Stripe checkout sessions (demo mode without STRIPE_SECRET_KEY)
- **Instant Download**: After purchase, users get a temporary secure download link
- **Admin Dashboard**: Password-protected (`staxadmin2026`) with revenue chart (Recharts), stats, order ledger, product CRUD

### Artifacts
- `artifacts/staxvibe` — React + Vite frontend, served at `/`
- `artifacts/api-server` — Express 5 API server, served at `/api`

### Admin Access
- URL: `/admin`
- Password: `staxadmin2026`

### Stripe Integration
Set `STRIPE_SECRET_KEY` environment variable to enable real Stripe checkout.
Without it, the app runs in demo mode (creates completed orders automatically).
Optional: Set `STRIPE_WEBHOOK_SECRET` for webhook signature verification.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v4 + shadcn/ui
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Payments**: Stripe
- **Build**: esbuild (CJS bundle)
- **Charts**: Recharts

## Database Schema
- `products` — id, name, description, price, category, image_url, file_url, featured, badge, created_at, updated_at
- `orders` — id, product_id, product_name, customer_email, amount_paid, status, stripe_session_id, download_token, created_at

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
