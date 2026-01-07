import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { googleAuth } from '@hono/oauth-providers/google';

import { errorHandler } from './middleware/errorHandler';
import { feedService, userService, authService } from './services';

const app = new Hono();

app.use(logger());

app.use(
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(
  '/v1/auth/google/cb',
  googleAuth({
    scope: ['openid', 'profile', 'email'],
    client_id: Bun.env.GOOGLE_CLIENT_ID,
    client_secret: Bun.env.GOOGLE_CLIENT_SECRET,
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
