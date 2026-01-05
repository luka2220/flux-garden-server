import { Hono } from 'hono';

import feedService from './services/feed';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { errorHandler } from './middleware/errorHandler';

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

app.onError(errorHandler);

app.route('/v1/feed', feedService);

export default {
  port: 8000,
  fetch: app.fetch,
};
