import express from "express";

export const getFeed = async (req: express.Request, res: express.Response) => {
  try {
    return res.sendStatus(200);
  } catch (error) {
    console.error("An error occurred in the getFeed controller:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return res.status(500).send("Something went wrong");
  }
};

export const getFeedById = async (
  req: express.Request,
  res: express.Response
) => {
  res.send("Hello World");
};

export const createFeed = async (
  req: express.Request,
  res: express.Response
) => {
  res.send("Hello World");
};
