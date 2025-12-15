import { Hono } from "hono";

import {
  getFeedController,
  createFeedController,
  getAllFeedController,
} from "../feed";

const feedRouter = new Hono();

feedRouter.get("/", getAllFeedController);
feedRouter.post("/", createFeedController);
feedRouter.get("/:id", getFeedController);

export default feedRouter;
