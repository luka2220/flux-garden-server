import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import type { HonoContext } from './shared/types/index';
import { errorHandler } from './middleware/errorHandler';
import { feedService, userService, authService } from './services';
import { getDbInstance } from './db/db';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';

const app = new Hono<HonoContext>();

app.onError(errorHandler);

app.use(logger());

app.use(
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Authentication Middleware
app.use('*', async (c, next) => {
  // const token = getCookie(c, 'authToken');
  // if (!token) {
  //   console.log('No authToken in exists in request cookies');
  //   return c.redirect('http://localhost:5173');
  // }

  try {
    // const decodedPayload = await verify(token, c.env.JWT_SECRET);

    // c.set('userId', decodedPayload.userId as string);
    // c.set('userEmail', decodedPayload.email as string);
    c.set('db', getDbInstance(c.env.DB));

    await next();
  } catch (error) {
    console.log('Auth token is unverified or expired: ', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
    });
    return c.redirect('http://localhost:5173');
  }
});

app.route('/v1/auth', authService);
app.route('/v1/feed', feedService);
app.route('/v1/user', userService);

export default {
  port: 8000,
  fetch: app.fetch,
};
