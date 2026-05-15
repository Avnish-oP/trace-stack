# TraceStack — Architecture & System Design Overview

## Project Overview

TraceStack is a multi-tenant observability and log monitoring SaaS platform that allows developers and organizations to:

* Collect logs from applications using SDKs
* Monitor systems in real time
* Search and filter logs efficiently
* Analyze application behavior
* Track usage metrics
* Manage subscriptions and billing
* Scale log ingestion using asynchronous architecture

The platform is inspired by products such as Datadog, Sentry, LogRocket, and New Relic.

---

# Core Product Vision

TraceStack is designed as a production-grade developer infrastructure platform.

Instead of building a simple CRUD application, the goal is to demonstrate:

* Distributed systems architecture
* Event-driven backend engineering
* Real-time communication
* Multi-tenant SaaS design
* SDK development
* Scalable ingestion pipelines
* Usage metering and billing systems

---

# High Level Architecture

```text
                    ┌────────────────────┐
                    │   Client Apps      │
                    │ (User Applications)│
                    └─────────┬──────────┘
                              │
                              │ SDK/API Calls
                              ▼
                    ┌────────────────────┐
                    │    SDK Layer       │
                    │  (Node SDK First)  │
                    └─────────┬──────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │     Ingestion API       │
                 │ Authentication + Queue  │
                 └─────────┬───────────────┘
                           │
                           ▼
                 ┌─────────────────────────┐
                 │    Redis Streams        │
                 │  Async Log Buffering    │
                 └─────────┬───────────────┘
                           │
                           ▼
                 ┌─────────────────────────┐
                 │   Processing Worker     │
                 │ Parse + Validate + Save │
                 └─────────┬───────────────┘
                           │
           ┌───────────────┴────────────────┐
           ▼                                ▼
┌────────────────────┐          ┌────────────────────┐
│    PostgreSQL      │          │ Redis Pub/Sub      │
│ Persistent Storage │          │ Realtime Streaming │
└─────────┬──────────┘          └─────────┬──────────┘
          │                               │
          ▼                               ▼
┌────────────────────┐          ┌────────────────────┐
│ Search + Analytics │          │ WebSocket Server   │
└─────────┬──────────┘          └─────────┬──────────┘
          │                               │
          └───────────────┬───────────────┘
                          ▼
               ┌────────────────────┐
               │  Next.js Dashboard │
               └────────────────────┘
```

---

# System Components

## 1. SDK Layer

### Purpose

The SDK is installed inside user applications and acts as the entry point for logs.

### Responsibilities

* Capture logs
* Batch logs
* Retry failed requests
* Attach metadata
* Send logs to ingestion API

### Example Usage

```js
logger.error("Payment Failed")
```

### Future SDKs

* Node.js SDK
* Python SDK
* Browser SDK

---

# 2. Ingestion API

## Purpose

Receives logs from SDKs.

## Responsibilities

* Validate API keys
* Validate payloads
* Apply rate limiting
* Push logs into queue
* Enforce billing limits

## Important Design Principle

The ingestion API should NEVER directly write logs to the database.

Correct flow:

```text
SDK → Queue → Worker → Database
```

This ensures scalability and fault tolerance.

---

# 3. Redis Streams / Queue Layer

## Purpose

Acts as asynchronous transport between ingestion and processing.

## Benefits

* Handles traffic spikes
* Decouples services
* Improves reliability
* Enables retries
* Prevents ingestion bottlenecks

## Initial Queue Technology

* Redis Streams
* BullMQ

## Future Upgrade

* Apache Kafka

---

# 4. Processing Worker

## Purpose

Consumes logs from queue and processes them.

## Responsibilities

* Validate logs
* Normalize fields
* Parse metadata
* Store logs in PostgreSQL
* Increment usage metrics
* Publish realtime events

## Future Responsibilities

* AI summarization
* Anomaly detection
* Alerting system
* Aggregation pipelines

---

# 5. PostgreSQL Database

## Purpose

Persistent storage layer.

## Stores

* Users
* Organizations
* Projects
* API keys
* Logs
* Subscription plans
* Usage metrics

## Important Features

* Indexed log queries
* JSONB metadata storage
* Multi-tenant schema
* Future partitioning support

---

# 6. Redis Pub/Sub

## Purpose

Realtime communication layer.

When logs are processed:

```text
Worker → Redis Pub/Sub → WebSocket Server → Dashboard
```

This powers realtime monitoring.

---

# 7. WebSocket Server

## Purpose

Streams live logs to connected dashboard clients.

## Responsibilities

* Manage socket connections
* Broadcast realtime logs
* Handle live updates

---

# 8. Dashboard Web Application

## Purpose

Frontend SaaS interface.

## Built Using

* Next.js
* TypeScript
* TailwindCSS
* Zustand
* TanStack Query

## Features

* Authentication
* Organization management
* Project management
* API key management
* Live logs
* Search & filtering
* Charts & analytics
* Billing dashboard

---

# Multi-Tenant SaaS Design

## Resource Ownership Structure

```text
User
  ↓
Organization
  ↓
Project
  ↓
Logs
```

## Why Multi-Tenancy?

Organizations may contain:

* Multiple users
* Multiple applications
* Multiple environments

This architecture enables scalable SaaS behavior.

---

# Database Design Overview

## Core Entities

```text
User
Organization
Project
APIKey
Log
SubscriptionPlan
OrganizationSubscription
UsageMetrics
```

---

# ER Relationship Flow

```text
User
 └── Organization
       └── Project
             ├── APIKey
             ├── Log
             └── UsageMetrics
```

---

# Log Lifecycle

## Complete Flow

### Step 1

Application generates log.

```js
logger.error("Payment Failed")
```

### Step 2

SDK batches logs.

### Step 3

SDK sends logs to ingestion API.

### Step 4

Ingestion API validates:

* API key
* payload
* rate limits
* subscription limits

### Step 5

Logs are pushed into Redis Streams.

### Step 6

Worker consumes logs.

### Step 7

Worker stores logs in PostgreSQL.

### Step 8

Worker publishes realtime events.

### Step 9

WebSocket server broadcasts updates.

### Step 10

Dashboard updates instantly.

---

# Billing & Usage Metering

## Pricing Strategy

Usage-based pricing.

### Example Plans

```text
Free Plan
- 10,000 logs/month

Pro Plan
- 1,000,000 logs/month
```

---

# Usage Tracking

Initially meter:

```text
logs_ingested_per_month
```

## Why Separate Usage Tracking?

Counting directly from logs table becomes expensive at scale.

Instead:

* increment counters during processing
* maintain aggregated usage metrics

---

# Payment System

## Payment Provider

* Razorpay

## Billing Flow

```text
User Upgrades
      ↓
Razorpay Checkout
      ↓
Webhook
      ↓
Backend Updates Subscription
      ↓
Plan Activated
```

---

# Scalability Principles

## 1. Stateless APIs

All APIs should remain horizontally scalable.

---

## 2. Queue-Based Architecture

Queues absorb traffic spikes.

---

## 3. Independent Workers

Workers scale independently from ingestion.

---

## 4. Indexed Queries

Critical indexes:

```text
project_id
created_at
level
service_name
```

---

## 5. Batched Processing

SDK batches logs before sending.

This reduces:

* request overhead
* DB load
* network usage

---

# Security Design

## Security Features

* JWT authentication
* API key hashing
* Rate limiting
* Helmet middleware
* CORS protection
* Input validation using Zod

---

# Hosting Architecture

## Frontend

* Vercel

## Backend

* Railway

## Database

* Supabase PostgreSQL

## Redis

* Upstash

---

# Future Enhancements

## Planned Upgrades

* Kafka migration
* Elasticsearch integration
* AI log summarization
* OpenTelemetry tracing
* Alert system
* Metrics aggregation
* ClickHouse support
* Kubernetes deployment
* Team collaboration

---

# Development Phases

## Phase 1

SaaS foundation.

## Phase 2

SDK + ingestion.

## Phase 3

Realtime dashboard.

## Phase 4

Queue architecture.

## Phase 5

Usage tracking.

## Phase 6

Billing integration.

## Phase 7

Advanced analytics.

## Phase 8

Production hardening.

---

# Engineering Goals

TraceStack is intentionally designed to demonstrate:

* Production backend architecture
* Distributed systems concepts
* Infrastructure engineering
* Realtime communication
* Multi-tenant SaaS patterns
* Event-driven systems
* Scalable observability pipelines
* Modern TypeScript backend development

---

# Target Resume Impact

After completion, the project should demonstrate:

* SaaS engineering
* SDK development
* Observability platform architecture
* Async processing pipelines
* Queue systems
* WebSocket systems
* Billing systems
* Distributed architecture
* Realtime monitoring
* Production-grade backend engineering
