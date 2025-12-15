import { getDbInstance } from "./db/db";
import type { FeedSchemaDb } from "./types";
import { Resp } from "./internal/response";
import type { Context } from "hono";
import Praser from "rss-parser";

const db = getDbInstance();
const parser = new Praser();

export const getAllFeedController = (c: Context) => {
  try {
    const d = db.query<FeedSchemaDb, []>(`select * from feeds`).all();

    return c.json(d);
  } catch (error) {
    console.error("An error occurred in getAllFeedController", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json(
      {
        message: "Something went wrong",
      },
      500
    );
  }
};

export const createFeedController = async (c: Context) => {
  return c.text("Created feed");
};

export const getFeedController = async (c: Context<any, "/v1/feed/:id">) => {
  try {
    const id = c.req.param("id");

    const d = db
      .query<FeedSchemaDb, [string]>(`select * from feeds where id = ?`)
      .get(id);
    if (!d) return c.text("Feed not found", 404);

    const parsedRss = await parser.parseURL(d.link);

    return c.json({
      content: parsedRss,
      feed: d,
    });
  } catch (error) {
    console.error("An error occurred in getFeedController", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json(
      {
        message: "Something went wrong",
      },
      500
    );
  }
};
