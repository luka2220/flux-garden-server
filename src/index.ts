import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import type { HonoContext } from "./shared/types/index"
import { errorHandler } from './middleware/errorHandler';
import { feedService, userService, authService } from './services';
import { getDbInstance } from './db/db';

const app = new Hono<HonoContext>();

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

app.onError(errorHandler);

app.route('/v1/feed', feedService);
app.route('/v1/user', userService);
app.route('/v1/auth', authService);

export default {
  port: 8000,
  fetch: app.fetch,
};
