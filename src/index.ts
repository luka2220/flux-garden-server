import { Hono } from "hono";

import feedRouter from "./routers/feedRouter";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.route("/v1/feed", feedRouter);

export default {
  port: 8000,
  fetch: app.fetch,
};
