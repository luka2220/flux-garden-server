import {
  getFeedController,
  createFeedController,
  getAllFeedController,
} from "./feed";

const server = Bun.serve({
  port: 8000,
  routes: {
    "/v1/feed": {
      GET: getAllFeedController,
      POST: createFeedController,
    },
    "/v1/feed/:id": getFeedController,
  },
  fetch(req) {
    return new Response("Route not found", { status: 404 });
  },
});
