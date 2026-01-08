import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import Praser from 'rss-parser';
import { feedsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { postFeedBodySchema } from '../shared/schemas';
import type { Database } from '../db/db';

type Variables = {
  db: Database;
};

export const feedService = new Hono<{ Variables: Variables }>();
const parser = new Praser();

feedService.get('/', async (c) => {
  const db = c.get('db');
  const d = await db.select().from(feedsTable).all();
  return c.json(d);
});

feedService.post('/', zValidator('json', postFeedBodySchema), async (c) => {
  const db = c.get('db');
  const validatedBody = c.req.valid('json');
  await db.insert(feedsTable).values(validatedBody);
  return c.text('', 201);
});

feedService.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const d = await db
    .select()
    .from(feedsTable)
    .where(eq(feedsTable.id, id))
    .limit(1)
    .execute();
  if (d.length === 0) return c.text('Feed not found', 404);

  const feed = d[0]!;

  const parsedRss = await parser.parseURL(feed.link);

  return c.json({
    content: parsedRss,
    feed: d,
  });
});
