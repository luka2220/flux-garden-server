import type { Database } from '@/db/db';

/**
 * Type binding from cloudflare secrets to inject into hono context
 * These are automagicaly injected by cloudflare
 */
export type Bindings = {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
  OXY_USERNAME: string;
  OXY_PASSWORD: string;
};

/**
 * Variables needed to be referenced in controllers
 */
export type Variables = {
  db: Database;
  userId: string;
  userEmail: string;
};

/** Hono instance type with injected conxtexts */
export type HonoContext = {
  Bindings: Bindings;
  Variables: Variables;
};
