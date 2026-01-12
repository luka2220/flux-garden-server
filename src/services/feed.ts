import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { XMLParser } from 'fast-xml-parser';
import { feedsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { postFeedBodySchema } from '../shared/schemas';
import { HonoContext } from '@/shared/types';

export const feedService = new Hono<HonoContext>();
const parser = new XMLParser();

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

  try {
    const response = await fetch(feed.link, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        Referer: 'https://www.google.com/',
      },
    });
    const xml = await response.text();
    const parsedRss = parser.parse(xml);
    return c.json({
      content: parsedRss,
      feed: d,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown Error';
    console.error('Error fetching feed: ', msg);
    throw new Error(`Error fetching feed: ${msg}`);
  }
});
