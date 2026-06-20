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

**Phase 2 Completed:**
- ✅ **Step 1 — Node.js SDK (`@trace-stack/node`)**: Built `packages/sdk-node/` with zero runtime dependencies. Features: `TraceStack` client class with 5 log-level methods (`debug`, `info`, `warn`, `error`, `fatal`), in-memory batcher (configurable batch size + flush interval), HTTP transport with exponential backoff retry (3 attempts), auto-attached system metadata (`hostname`, `pid`, `nodeVersion`), graceful shutdown via `SIGTERM`/`SIGINT`/`beforeExit` handlers, API key validation, and full TypeScript types. Typechecks clean.
- ✅ **Step 2 — Ingestion API Hardening**: Extracted API key auth into dedicated middleware (`api-key-auth.middleware.ts`), added Redis-backed sliding window rate limiter (`rate-limit.middleware.ts`) with `X-RateLimit-*` response headers and configurable limits via env vars (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SECONDS`), added centralized error handler middleware, created Zod-validated env config (`src/config/index.ts`), changed response status `200` → `202 Accepted`, added `X-Request-Id` UUID header for traceability, added `/batch` route alias, configured CORS with env-based origin, removed unused `jsonwebtoken` dependency, cleaned up stale local `prisma/` directory. Service updated to return `{ projectId, apiKeyId }` for per-key rate limiting. Typechecks clean.
- ✅ **Step 3 — Integration Testing**: SDK → Ingestion end-to-end verification completed. Automated test script creates a dummy user, org, project, API Key using Prisma, sends logs using the new `@trace-stack/node` SDK, verifies database insertion, and cleans up dummy data.

**Phase 3 Completed:**
- ✅ **Queue Architecture (BullMQ)**: Decoupled ingestion from storage. Ingestion API now pushes log batches to a Redis-backed `log-ingestion` BullMQ queue and returns 202 immediately. Added Bull Board UI at `/admin/queues` on ingestion-api for queue monitoring.
- ✅ **Processing Worker (`apps/processing-worker/`)**: New standalone Node.js service consuming from BullMQ. Batch inserts logs to PostgreSQL via `@trace-stack/db` and publishes each log to Redis Pub/Sub channel `logs:{projectId}` for real-time streaming.
- ✅ **Integration Verified**: Updated integration test to handle async queue processing with polling. Full pipeline SDK → Ingestion → BullMQ → Worker → DB passes end-to-end.

**Phase 4 Completed:**
- ✅ **WebSocket Server (`apps/ws-server/`)**: Standalone Socket.IO server on port 3003. JWT-authenticated connections using shared `API_JWT_SECRET`. Clients join project rooms. Redis Pub/Sub subscriber (`psubscribe logs:*`) bridges processed logs to connected dashboard clients in real-time.
- ✅ **Live Log Viewer**: New `/dashboard/projects/[projectId]/live` page with real-time streaming via `useLogStream` hook (Socket.IO client). Features: connection status indicator, auto-scroll with "jump to latest", pause/resume with buffered count, level filter toggles, client-side search, expandable metadata rows, terminal-inspired premium UI.
- ✅ **Sidebar Updated**: Added animated "Live" nav link with pulsing green dot under active projects.

**Pipeline Verification & Debugging Completed:**
- Fixed a database connection mismatch where `ingestion-api` and `processing-worker` were pointing to `logforge` instead of the central `tracestack-db`. All `.env` files are now unified.
- Fixed an API Key validation logic mismatch. Both `api-server` and `ingestion-api` now correctly extract the first 12 characters as the prefix for O(1) database lookups.
- Fixed a routing bug in `api-server` where the logs endpoint was erroneously mounted at `/api/v1/logs/projects/:projectId/logs`. It is now correctly mounted at `/api/v1/projects/:projectId/logs`.
- Fixed a validation bug in `validate.middleware.ts` by using `Object.defineProperty` to override `req.query`, allowing Zod to correctly inject numeric values for Prisma's `take` and `skip`.
- Eliminated double-polling on the Logs viewer page by removing a manual `setInterval` and delegating interval control natively to React Query.
- ✅ The entire E2E pipeline (Node SDK -> Ingestion API -> BullMQ -> Processing Worker -> Postgres & Redis PubSub -> WebSocket Server -> Next.js Live Tail & Historical Logs) has been fully validated and is completely functional.

**Current Focus:**
- Ready to proceed to **Phase 5 (Usage Tracking / Rate Limiting)** to implement metered billing limits.
- Ready to finalize the **Deployment Plan** for Vercel, Render, Supabase, and Upstash.

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
