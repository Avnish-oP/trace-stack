// ─── Log Levels ──────────────────────────────────────────────

export const LOG_LEVELS = ["debug", "info", "warn", "error", "fatal"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

// ─── Environments ────────────────────────────────────────────

export const ENVIRONMENTS = [
  "development",
  "staging",
  "production",
] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

// ─── API Key Config ──────────────────────────────────────────

/** Prefix length stored unhashed for O(1) lookup */
export const API_KEY_PREFIX_LENGTH = 8;

/** Prefix added to all generated API keys for identification */
export const API_KEY_IDENTIFIER = "ts_";

// ─── Pagination Defaults ─────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 200;

// ─── Rate Limiting ───────────────────────────────────────────

/** Max log ingestion requests per API key per minute */
export const INGESTION_RATE_LIMIT = 100;

/** Max API requests per user per minute */
export const API_RATE_LIMIT = 60;

// ─── Billing Plan Limits ─────────────────────────────────────

export const PLAN_LIMITS = {
  free: {
    logsPerMonth: 10_000,
    projectsPerOrg: 3,
    apiKeysPerProject: 2,
  },
  pro: {
    logsPerMonth: 1_000_000,
    projectsPerOrg: 20,
    apiKeysPerProject: 10,
  },
  enterprise: {
    logsPerMonth: -1, // unlimited
    projectsPerOrg: -1,
    apiKeysPerProject: -1,
  },
} as const;

export type PlanTier = keyof typeof PLAN_LIMITS;

// ─── HTTP Status Messages ────────────────────────────────────

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Insufficient permissions",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation failed",
  RATE_LIMITED: "Too many requests, please try again later",
  INTERNAL_ERROR: "Internal server error",
  API_KEY_REQUIRED: "API key is required",
  API_KEY_INVALID: "Invalid API key",
  PLAN_LIMIT_EXCEEDED: "Plan limit exceeded. Please upgrade your subscription.",
} as const;
