import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

import feedRouter from "./routes/feed";

const app = express();

app.use(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(`${req.method} -> ${req.url}`); // simple logging for now...

    const client = new MongoClient(process.env.DB_CONNECTION_STRING!);
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);

    console.log(movie);

    next();
  }
);

app.use("/feed", feedRouter);

app.listen(8000);
