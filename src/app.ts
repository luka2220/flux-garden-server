import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import feedRouter from "./routes/feed";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    allowedHeaders: ["GET", "POST", "OPTIONS"],
  }),
);
app.use(express.json());

app.use(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.log(`${req.method} -> ${req.url}`); // simple logging for now...
    console.log(req);
    next();
  },
);

app.use("/feed", feedRouter);

const PORT = process.env.PORT!;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
