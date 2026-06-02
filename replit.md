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
- **Admin Dashboard**: Password-protected (`YOUR_ADMIN_PASSWORD`) with revenue chart (Recharts), stats, order ledger, product CRUD

### Artifacts
- `artifacts/staxvibe` — React + Vite frontend, served at `/`
- `artifacts/api-server` — Express 5 API server, served at `/api`

### Admin Access
- URL: `/admin`
- Password: `YOUR_ADMIN_PASSWORD`

### Stripe Integration
Set `STRIPE_SECRET_KEY` environment variable to enable real Stripe checkout.
Without it, the app runs in demo mode (creates completed orders automatically).
Optional: Set `STRIPE_WEBHOOK_SECRET` for webhook signature verification.

### Email (SMTP via Nodemailer)
Without these, checkout still works but no confirmation email is sent.
- `SMTP_HOST` — e.g. `smtp.gmail.com` / `smtp.sendgrid.net` / `mail.privateemail.com`
- `SMTP_PORT` — `587` (TLS, default) or `465` (SSL)
- `SMTP_USER` — your SMTP login / email address
- `SMTP_PASS` — your SMTP password or app password
- `SMTP_FROM_NAME` — (optional) display name, e.g. `StaxVibe AI Graphics`
- `SMTP_FROM_EMAIL` — (optional) from address, defaults to SMTP_USER

### All Secrets Reference
| Secret | Required | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | For real payments | Stripe checkout |
| `STRIPE_WEBHOOK_SECRET` | For webhook verification | Stripe event auth |
| `SMTP_HOST` | For emails | SMTP server host |
| `SMTP_PORT` | For emails | SMTP port (default 587) |
| `SMTP_USER` | For emails | SMTP username |
| `SMTP_PASS` | For emails | SMTP password/app key |
| `SMTP_FROM_NAME` | Optional | Email sender display name |
| `SMTP_FROM_EMAIL` | Optional | Email from address |

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
