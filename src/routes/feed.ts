import { Router } from "express";
import { getFeed, getFeedById, createFeed } from "../controllers/feed";

const feedRouter: Router = Router();

feedRouter.post("/", createFeed);
feedRouter.get("/", getFeed);
feedRouter.get("/:id", getFeedById);

export default feedRouter;
