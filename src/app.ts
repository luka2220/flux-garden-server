import dotenv from "dotenv";
dotenv.config();

import express from "express";
import feedRouter from "./routes/feed";

const app = express();

app.use(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(`${req.method} -> ${req.url}`); // simple logging for now...
    next();
  }
);

app.use("/feed", feedRouter);

app.listen(8000);
