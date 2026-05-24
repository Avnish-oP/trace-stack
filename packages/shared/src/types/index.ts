import type { LogLevel, PlanTier } from "../constants";

// ─── API Response Wrapper ────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Auth Types ──────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string | null;
}

// ─── Organization Types ──────────────────────────────────────

export interface OrgSummary {
  id: string;
  name: string;
  projectCount: number;
  createdAt: string;
}

// ─── Project Types ───────────────────────────────────────────

export interface ProjectSummary {
  id: string;
  name: string;
  environment: string;
  logCount: number;
  apiKeyCount: number;
  createdAt: string;
}

// ─── API Key Types ───────────────────────────────────────────

/** Returned only once at creation time */
export interface ApiKeyCreated {
  id: string;
  name: string;
  rawKey: string;
  prefix: string;
  createdAt: string;
  expiresAt: string | null;
}

/** Returned on list — raw key is never shown again */
export interface ApiKeySummary {
  id: string;
  name: string;
  prefix: string;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

// ─── Log Types ───────────────────────────────────────────────

export interface LogSummary {
  id: string;
  level: LogLevel;
  message: string;
  serviceName: string;
  source: string | null;
  metadata: Record<string, unknown> | null;
  timestamp: string;
  createdAt: string;
}

// ─── Usage Types ─────────────────────────────────────────────

export interface UsageSummary {
  plan: PlanTier;
  logsIngested: number;
  logsLimit: number;
  percentUsed: number;
  periodStart: string;
  periodEnd: string;
}
