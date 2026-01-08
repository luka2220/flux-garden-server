import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { googleAuth } from '@hono/oauth-providers/google';

import { errorHandler } from './middleware/errorHandler';
import { feedService, userService, authService } from './services';
import { getDbInstance, Database } from './db/db';

type Bindings = {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};

type Variables = {
  db: Database;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Inject database into context
app.use('*', async (c, next) => {
  c.set('db', getDbInstance(c.env.DB));
  await next();
});

app.use(logger());

app.use(
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use('/v1/auth/google/cb', async (c, next) => {
  const handler = googleAuth({
    scope: ['openid', 'profile', 'email'],
    client_id: c.env.GOOGLE_CLIENT_ID,
    client_secret: c.env.GOOGLE_CLIENT_SECRET,
  });
  return handler(c, next);
});

app.onError(errorHandler);

app.route('/v1/feed', feedService);
app.route('/v1/user', userService);
app.route('/v1/auth', authService);

export default {
  port: 8000,
  fetch: app.fetch,
};
