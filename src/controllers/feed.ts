import { handleControllerError } from "../utils";
import { mongoInstance } from "../db";
import { ResponseMessages, StatusResponseCode } from "../config/constants";
import { createFeedSchema, getFeedByIdSchema } from "../schemas";
import Parser from "rss-parser";
import { ObjectId } from "mongodb";

/** Creates a new feed */
export const createFeed = handleControllerError(
  "createFeed",
  async (req, res) => {
    const parsedBody = createFeedSchema.safeParse(req.body);
    if (!parsedBody.success)
      return res.status(StatusResponseCode.BadRequest).json({
        message: ResponseMessages.InvalidRequestBody,
        hints: parsedBody.error.issues,
      });

    const { name, link } = parsedBody.data;

    await mongoInstance.db("flux_garden").collection("feeds").insertOne({
      name,
      link,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return res.sendStatus(StatusResponseCode.Created);
  }
);

/** Gets all feeds */
export const getFeed = handleControllerError("getFeed", async (req, res) => {
  const feeds = await mongoInstance
    .db("flux_garden")
    .collection("feeds")
    .find()
    .toArray();

  return res.status(StatusResponseCode.Success).json(feeds);
});

/** Gets a feed by id */
export const getFeedById = handleControllerError(
  "getFeedById",
  async (req, res) => {
    const parsedParams = getFeedByIdSchema.safeParse(req.params);
    if (!parsedParams.success)
      return res.status(StatusResponseCode.BadRequest).json({
        message: ResponseMessages.InvalidRequestParams,
        hints: parsedParams.error.issues,
      });

    const parser = new Parser({
      requestOptions: {
        rejectUnauthorized: false,
      },
    });

    const feed = await mongoInstance
      .db("flux_garden")
      .collection("feeds")
      .findOne({ _id: new ObjectId(parsedParams.data.id) });

    if (!feed)
      return res.status(StatusResponseCode.NotFound).json({
        message: ResponseMessages.ResourceNotFound,
      });

    const parsedFeed = await parser.parseURL(feed.link);

    return res.status(StatusResponseCode.Success).json({
      item: feed,
      content: parsedFeed,
    });
  }
);
