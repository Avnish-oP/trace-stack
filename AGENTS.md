# TraceStack — Agent Context & Design Guidelines

This file serves as a reference for agents working on the TraceStack project to maintain consistency in architecture, current progress, and design preferences.

## 🚀 Current Progress

**Phase 1 Completed:**
- **Monorepo Setup**: Configured `apps/` and `packages/` with `concurrently` for local development.
- **Shared DB (`@trace-stack/db`)**: Prisma schema enhanced with `ApiKey.prefix` for O(1) lookups, cascade deletes, and NextAuth `User.image` support. Prisma client singleton exported.
- **Shared Types (`@trace-stack/shared`)**: Zod schemas and TypeScript DTOs.
- **Backend Scaffold**: `apps/api-server` (Dashboard API) and `apps/ingestion-api` (Log ingestion) set up with Express, Zod validation, and basic middleware.
- **Authentication System**: Email/password auth implemented with NextAuth credentials in `apps/dashboard`, JWT verification in `apps/api-server`, Redis-backed rate limiting, Resend email verification, default organization creation on registration, and protected dashboard routing.
- **API Server CRUD**: Implemented full controllers and services for Organizations, Projects, API Keys, and Logs with strict multi-tenant validation.
- **Premium Dashboard UI**: Constructed glassmorphism-themed UI components (Card, Button, Modal, Input, Table) in Tailwind v4 and built dynamic routing pages for managing organizations, projects, API keys, and viewing logs. Fully integrated with TanStack Query.

**Phase 2 In Progress:**
- ✅ **Step 1 — Node.js SDK (`@trace-stack/node`)**: Built `packages/sdk-node/` with zero runtime dependencies. Features: `TraceStack` client class with 5 log-level methods (`debug`, `info`, `warn`, `error`, `fatal`), in-memory batcher (configurable batch size + flush interval), HTTP transport with exponential backoff retry (3 attempts), auto-attached system metadata (`hostname`, `pid`, `nodeVersion`), graceful shutdown via `SIGTERM`/`SIGINT`/`beforeExit` handlers, API key validation, and full TypeScript types. Typechecks clean.
- ⬜ **Step 2 — Ingestion API Hardening**: Add Redis-backed rate limiting middleware, extract API key auth into middleware, HTTP 202, request IDs, Zod config.
- ⬜ **Step 3 — Integration Testing**: SDK → Ingestion end-to-end verification.

**Current Focus:**
- Phase 2 Step 2: Ingestion API Hardening.

## 🎨 Design System & Preferences

We are building a premium, developer-facing observability SaaS platform (inspired by Datadog, Vercel, Linear).

**Visual Direction:**
- **Theme**: Dark mode by default. Deep navy/charcoal backgrounds (`#0a0a0a` to `#0f111a`).
- **Primary Colors**:
  - Electric Purple: `#6C5CE7`
  - Neon Cyan: `#00CEC9`
  - Soft Pink (Errors): `#FD79A8`
- **Typography**:
  - Headings & Body: `Inter` (or similar clean sans-serif like Geist).
  - Code & Data: `Space Mono` or `Geist Mono`.
- **Aesthetic**:
  - Technical, modern, minimal.
  - **Glassmorphism**: Cards and panels should use frosted glass effects (`bg-white/5` or `bg-black/40` with `backdrop-blur` and subtle borders `border-white/10`).
  - **Gradients**: Subtle purple-to-cyan gradients for primary buttons, glowing effects, and accent text.
  - Generous whitespace and clean alignments.

## 🏗 Architecture Principles
- **Ingestion**: The `ingestion-api` must be extremely fast. It should validate (O(1) prefix lookup) and push to a queue (to be implemented in Phase 3) — NEVER write directly to PostgreSQL.
- **Dashboard DB Access**: The Next.js frontend should NOT connect directly to the database. It must fetch all data via the `api-server` endpoints using Axios.
- **Auth**: Managed by NextAuth (Credentials provider calling `api-server` for JWT verification).
