import { getDbInstance } from "./db/db";
import type { FeedSchemaDb } from "./types";

const db = getDbInstance();

export const getAllFeedController = () => {
  const d = db.query<FeedSchemaDb, []>(`select * from feeds`).all();

  return d.length === 0
    ? new Response("No feeds found", {
        status: 404,
      })
    : new Response(JSON.stringify(d), {
        headers: { "Content-Type": "application/json" },
      });
};

export const createFeedController = async (req: Bun.BunRequest) => {
  return new Response("Created feed");
};

export const getFeedController = (req: Bun.BunRequest<"/v1/feed/:id">) => {
  const id = req.params.id;

  const d = db
    .query<FeedSchemaDb, [string]>(`select * from feeds where id = ?`)
    .get(id);

  return d
    ? new Response(JSON.stringify(d))
    : new Response("Feed not found", {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
};
