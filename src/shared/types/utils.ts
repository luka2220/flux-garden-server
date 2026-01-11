import type { Database } from '@/db/db';

/**
 * Type binding for cloudflare secrets to inject into hono context
 */
export type Bindings = {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
};

/**
 * Variables needed to be referenced in controllers
 * Injected into hono context
 */
export type Variables = {
  db: Database;
};

/** Hono instance type with injected conxtexts */
export type HonoContext = {
  Bindings: Bindings;
  Variables: Variables;
};
