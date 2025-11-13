import express from "express";
import dotenv from "dotenv";
import * as mongoose from "mongoose";

dotenv.config();

import feedRouter from "./routes/feed";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(`${req.method} -> ${req.url}`); // simple logging for now...
    await mongoose.connect(process.env.DB_CONNECTION_STRING!);
    next();
  }
);

app.use("/feed", feedRouter);

app.listen(8000);
