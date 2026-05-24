# TraceStack — Development Plan (Phases 1–4)

## Architecture Decisions

| Decision | Choice |
|----------|--------|
| **Authentication** | NextAuth (JWT strategy) in Dashboard, credentials provider calls API Server |
| **Frontend DB access** | None — Dashboard is frontend-only, all data via API endpoints |
| **Monorepo tooling** | Current `concurrently` approach |
| **Dev environment** | Local Docker (Postgres + Redis) |
| **Production** | Vercel (dashboard), Railway (backend services), Supabase (DB), Upstash (Redis) |
| **Multi-member orgs** | Deferred to later phase |

---

## Current State

- **Ingestion API**: Basic Express server, direct DB writes (needs queue refactor), O(n) API key validation
- **Dashboard**: Default Next.js boilerplate, no custom UI
- **Schema**: Has User, Organization, Project, ApiKey, Log. Missing billing/usage models
- **SDK, Worker, WebSocket, Queue**: Not started
- **packages/**: Empty

---

## Target Monorepo Structure (After Phase 4)

```
trace-stack/
├── apps/
│   ├── ingestion-api/         # Log ingestion from SDKs (Express)
│   ├── api-server/            # Dashboard backend API (Express)
│   ├── processing-worker/     # Queue consumer (BullMQ)
│   ├── ws-server/             # WebSocket server (Socket.IO)
│   └── dashboard/             # Next.js frontend (NextAuth + UI)
├── packages/
│   ├── db/                    # Shared Prisma schema + client (backend only)
│   ├── shared/                # Shared types, Zod schemas, constants
│   └── sdk-node/              # Node.js SDK (@trace-stack/node)
├── docker-compose.yml
├── package.json
└── plan.md
```

---

## Phase 1 — SaaS Foundation

**Goal**: Auth, org/project CRUD, API key management, shared DB package, basic dashboard UI.

### 1.1 Shared Database Package — `packages/db/`

Move Prisma schema out of `ingestion-api` into a shared workspace package.

**Files:**
- `packages/db/package.json` — name: `@trace-stack/db`
- `packages/db/prisma/schema.prisma` — moved from `apps/ingestion-api/prisma/`
- `packages/db/src/index.ts` — exports PrismaClient singleton
- `packages/db/tsconfig.json`

**Schema** (extend existing):
- Keep: `User`, `Organization`, `Project`, `ApiKey`, `Log`
- Add `ApiKey.prefix` field (first 8 chars, unhashed) for O(1) lookup
- Add `User.image` field for NextAuth avatar support

Both `ingestion-api` and `api-server` depend on `@trace-stack/db`. Dashboard does NOT.

### 1.2 Shared Types — `packages/shared/`

**Files:**
- `packages/shared/package.json` — name: `@trace-stack/shared`
- `packages/shared/src/schemas/log.schema.ts` — Zod schema for log payloads
- `packages/shared/src/schemas/auth.schema.ts` — Zod schemas for register/login
- `packages/shared/src/schemas/org.schema.ts` — Zod schemas for org/project
- `packages/shared/src/types/index.ts` — Shared TypeScript interfaces
- `packages/shared/src/constants.ts` — Log levels, defaults
- `packages/shared/src/index.ts` — barrel export

### 1.3 API Server — `apps/api-server/`

Express backend serving all dashboard data needs.

**Routes:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login, return JWT |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/orgs` | Create organization |
| GET | `/api/v1/orgs` | List user's orgs |
| GET | `/api/v1/orgs/:orgId` | Get org detail |
| PUT | `/api/v1/orgs/:orgId` | Update org |
| DELETE | `/api/v1/orgs/:orgId` | Delete org |
| POST | `/api/v1/orgs/:orgId/projects` | Create project |
| GET | `/api/v1/orgs/:orgId/projects` | List projects |
| GET | `/api/v1/projects/:projectId` | Get project detail |
| PUT | `/api/v1/projects/:projectId` | Update project |
| DELETE | `/api/v1/projects/:projectId` | Delete project |
| POST | `/api/v1/projects/:projectId/api-keys` | Generate API key |
| GET | `/api/v1/projects/:projectId/api-keys` | List API keys |
| DELETE | `/api/v1/api-keys/:keyId` | Revoke API key |
| GET | `/api/v1/projects/:projectId/logs` | Get logs (paginated, filterable) |

**Key files:**
```
apps/api-server/
├── src/
│   ├── index.ts                        # Server entry
│   ├── config/index.ts                 # Env config with Zod validation
│   ├── middlewares/
│   │   ├── auth.middleware.ts           # JWT verification → req.user
│   │   ├── validate.middleware.ts       # Generic Zod validation
│   │   ├── rate-limit.middleware.ts     # Rate limiting
│   │   └── error-handler.middleware.ts  # Global error handler
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── org.routes.ts
│   │   ├── project.routes.ts
│   │   ├── apikey.routes.ts
│   │   └── log.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── org.controller.ts
│   │   ├── project.controller.ts
│   │   ├── apikey.controller.ts
│   │   └── log.controller.ts
│   ├── services/
│   │   ├── auth.service.ts             # Register, login, password hashing
│   │   ├── org.service.ts              # Org CRUD
│   │   ├── project.service.ts          # Project CRUD
│   │   ├── apikey.service.ts           # Key generation, hashing, prefix lookup
│   │   └── log.service.ts             # Log queries with filters
│   └── utils/
│       ├── apiResponse.ts              # Standardized { success, data, error }
│       └── errors.ts                   # Custom AppError classes
├── package.json
├── tsconfig.json
└── .env
```

### 1.4 Refactor Ingestion API — `apps/ingestion-api/`

- Remove local Prisma schema → depend on `@trace-stack/db`
- Remove `src/lib/prisma.ts` → import from `@trace-stack/db`
- Refactor `validateApiKey()` → prefix-based O(1) lookup:
  1. Extract first 8 chars from incoming key
  2. `findFirst({ where: { prefix } })` — single DB query
  3. bcrypt-verify only that one match
- Replace manual validation with Zod from `@trace-stack/shared`
- Add proper error handling middleware

### 1.5 Dashboard — `apps/dashboard/`

**Install:** `next-auth`, `@tanstack/react-query`, `axios`, `zustand`, `lucide-react`

**NextAuth Setup:**
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth config
- Credentials provider → calls `api-server /auth/login`
- JWT strategy (no DB session table needed)
- Session includes `userId`, `email`, `name`, `accessToken`

**Pages:**

| Route | Purpose |
|-------|---------|
| `/login` | Login form |
| `/register` | Registration form |
| `/dashboard` | Overview (org list, recent activity) |
| `/dashboard/orgs/[orgId]` | Org detail + project list |
| `/dashboard/projects/[projectId]` | Project detail + API keys |
| `/dashboard/projects/[projectId]/logs` | Log viewer (table, pagination, filters) |

**Layout:**
- Sidebar navigation (orgs, projects)
- Top bar (user avatar, logout)
- Dark theme with modern design (glassmorphism, gradients)
- Responsive design

### 1.6 Docker & Config

- Update `docker-compose.yml` container names from `logforge-*` to `tracestack-*`
- Add `.env.example` for `api-server` and `ingestion-api`
- Update root `package.json` dev script to run all services

---

## Phase 2 — SDK + Ingestion Hardening

**Goal**: Node.js SDK with batching/retry, harden ingestion API with rate limiting.

### 2.1 Node.js SDK — `packages/sdk-node/`

Published as `@trace-stack/node`.

**Usage:**
```ts
import { TraceStack } from "@trace-stack/node";

const logger = new TraceStack({
  apiKey: "ts_live_xxxx",
  serviceName: "payment-service",
  endpoint: "https://ingest.tracestack.dev", // optional
  batchSize: 50,       // flush every 50 logs
  flushInterval: 5000, // or every 5 seconds
});

logger.info("User logged in", { userId: "123" });
logger.error("Payment failed", { orderId: "456", amount: 999 });
logger.warn("High memory usage", { memoryMB: 450 });
```

**Key files:**
```
packages/sdk-node/
├── src/
│   ├── index.ts          # Barrel export
│   ├── client.ts         # TraceStack class (main entry)
│   ├── batcher.ts        # In-memory buffer, flush on size/interval
│   ├── transport.ts      # HTTP POST with exponential backoff retry (3x)
│   └── types.ts          # Public types (LogLevel, TraceStackConfig, etc.)
├── package.json
├── tsconfig.json
└── README.md
```

**Features:**
- Log levels: `debug`, `info`, `warn`, `error`, `fatal`
- Auto-metadata: `hostname`, `pid`, `nodeVersion`, `timestamp`
- Batching: configurable batch size + flush interval
- Retry: exponential backoff (3 attempts)
- Graceful shutdown: flush buffer on `SIGTERM` / `SIGINT`
- TypeScript-first

### 2.2 Ingestion API Hardening

- `src/middlewares/rate-limit.middleware.ts` — Per-API-key rate limiting (Redis-backed, sliding window)
- `src/middlewares/validate.middleware.ts` — Zod validation middleware
- `src/config/index.ts` — Centralized env config with Zod
- Replace manual `if` checks in controller with Zod schemas
- Add request size limit (`express.json({ limit: '1mb' })`)
- Add proper HTTP status codes (202 Accepted for async ingestion)

---

## Phase 3 — Queue Architecture (Redis Streams + BullMQ)

**Goal**: Decouple ingestion from storage. Ingestion pushes to queue, worker consumes.

> **Critical change**: After this phase, the ingestion API will NEVER write to PostgreSQL directly.

### 3.1 Ingestion API Changes

**New flow:**
```
SDK → Ingestion API → validate → push to BullMQ → return 202 Accepted
```

**Files:**
- `src/lib/redis.ts` — ioredis client singleton
- `src/lib/queue.ts` — BullMQ queue producer (`log-ingestion` queue)
- Refactor `ingest.controller.ts` — replace `prisma.log.createMany()` with `queue.add()`

### 3.2 Processing Worker — `apps/processing-worker/`

Standalone Node.js process consuming from BullMQ.

**Files:**
```
apps/processing-worker/
├── src/
│   ├── index.ts                    # Worker entry point
│   ├── worker.ts                   # BullMQ worker setup
│   ├── processors/
│   │   ├── log.processor.ts        # Validate → normalize → batch INSERT
│   │   └── realtime.processor.ts   # Publish to Redis Pub/Sub
│   ├── lib/
│   │   ├── redis.ts                # Redis client
│   │   └── pubsub.ts               # Redis Pub/Sub publisher
│   └── config/index.ts             # Env config
├── package.json
├── tsconfig.json
└── .env
```

**Processing pipeline per job:**
1. Deserialize log batch from queue
2. Validate & normalize fields
3. `prisma.log.createMany()` — batch insert
4. Publish each log to Redis Pub/Sub channel `logs:{projectId}`

### 3.3 Docker Compose Updates

- Ensure Redis supports Streams (already does with `redis/redis-stack`)
- Add optional Bull Board UI on port `3001` for dev monitoring

### 3.4 Update Root Scripts

```json
{
  "dev": "concurrently \"npm run dev -w apps/dashboard\" \"npm run dev -w apps/ingestion-api\" \"npm run dev -w apps/api-server\" \"npm run dev -w apps/processing-worker\""
}
```

---

## Phase 4 — Real-time Dashboard (WebSockets)

**Goal**: Live log streaming — Worker → Redis Pub/Sub → WebSocket Server → Dashboard.

### 4.1 WebSocket Server — `apps/ws-server/`

**Files:**
```
apps/ws-server/
├── src/
│   ├── index.ts                  # Server entry (HTTP + Socket.IO)
│   ├── handlers/
│   │   └── connection.ts         # Handle join/leave project rooms
│   ├── lib/
│   │   ├── redis-subscriber.ts   # Subscribe to Redis Pub/Sub
│   │   └── auth.ts               # Verify JWT from connection handshake
│   └── config/index.ts           # Env config
├── package.json
├── tsconfig.json
└── .env
```

**Flow:**
```
1. Dashboard connects via Socket.IO with JWT token
2. Server verifies JWT, extracts userId
3. Client joins room `project:{projectId}` (after access check)
4. Redis Pub/Sub subscriber receives logs on `logs:{projectId}`
5. Server broadcasts to all clients in that room
```

### 4.2 Dashboard — Live Log Viewer

**New components:**
- `src/hooks/useLogStream.ts` — Socket.IO client hook
- `src/components/logs/LiveLogViewer.tsx` — Real-time log stream UI
  - Auto-scroll with "pinned to bottom" toggle
  - Color-coded log levels (green=info, yellow=warn, red=error, purple=fatal)
  - Pause/resume stream button
  - Real-time level filter checkboxes
  - Search within visible logs
  - Connection status indicator (connected/reconnecting/disconnected)
- `src/components/logs/LogEntry.tsx` — Single log row with expandable metadata
- `src/components/logs/LogFilters.tsx` — Filter controls

**Route:** `/dashboard/projects/[projectId]/live` — Live log page

### 4.3 Update Root Dev Script

Add `ws-server` to concurrently:
```json
{
  "dev": "concurrently \"npm run dev -w apps/dashboard\" \"npm run dev -w apps/ingestion-api\" \"npm run dev -w apps/api-server\" \"npm run dev -w apps/processing-worker\" \"npm run dev -w apps/ws-server\""
}
```

---

## Verification Plan

### Phase 1
1. Register a user via `/auth/register`
2. Login → get JWT
3. Create org → create project → generate API key
4. cURL `POST /api/v1/logs/ingest` with API key header → logs appear in DB
5. Dashboard: login → see orgs → see projects → see API keys → view logs

### Phase 2
1. Create a test Node.js app
2. Install SDK → configure with API key
3. Send 100 logs → verify all appear in DB
4. Kill ingestion API → verify SDK retries and doesn't crash
5. Verify rate limiting returns 429 when exceeded

### Phase 3
1. Send logs via SDK → verify they go to BullMQ (check Bull Board)
2. Worker picks up jobs → logs appear in DB
3. Kill worker → send logs → restart worker → verify logs are processed (durability)
4. Verify Redis Pub/Sub receives events

### Phase 4
1. Open dashboard live view for a project
2. Send log via SDK → see it appear in real-time on dashboard
3. Test with multiple browser tabs (same project)
4. Test pause/resume, level filtering
5. Disconnect/reconnect WebSocket → verify auto-reconnect

---

## Execution Order Within Each Phase

### Phase 1
1. `packages/db/` — shared Prisma package
2. `packages/shared/` — shared types and schemas
3. `apps/api-server/` — backend API
4. Refactor `apps/ingestion-api/` — use shared packages
5. `apps/dashboard/` — NextAuth + UI pages
6. Docker + config cleanup

### Phase 2
1. `packages/sdk-node/` — build and test SDK
2. Harden `apps/ingestion-api/` — rate limiting, validation
3. Integration test: SDK → ingestion

### Phase 3
1. Add BullMQ to `apps/ingestion-api/` (producer)
2. Build `apps/processing-worker/` (consumer)
3. Remove direct DB writes from ingestion
4. Add Redis Pub/Sub publishing to worker

### Phase 4
1. Build `apps/ws-server/`
2. Add live log viewer to dashboard
3. End-to-end test: SDK → queue → worker → pub/sub → WS → dashboard
