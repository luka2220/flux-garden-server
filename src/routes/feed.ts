import { Router } from "express";
import { getFeed, getFeedById, createFeed } from "../controllers/feed";

const feedRouter: Router = Router();

feedRouter.get("/", getFeed);
feedRouter.post("/", createFeed);
feedRouter.get("/:id", getFeedById);

export default feedRouter;
