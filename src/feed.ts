import { getDbInstance } from "./db";

const db = getDbInstance();

export const getAllFeedController = () => {
  const q = db.query(`select * from feeds`);
  const d = q.all();

  console.log(d);

  return new Response("Get feeds");
};

export const createFeedController = async (req: Bun.BunRequest) => {
  return new Response("Created feed");
};

export const getFeedController = (req: Bun.BunRequest<"/v1/feed/:id">) => {
  return new Response("Feed");
};
