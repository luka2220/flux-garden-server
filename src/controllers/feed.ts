import { handleControllerError } from "../utils";
import { mongoInstance } from "../db";
import { StatusResponseCode } from "../config/constants";

/** Creates a new feed */
export const createFeed = handleControllerError(
  "createFeed",
  async (req, res) => {
    const feed = await mongoInstance
      .db("sample_mflix")
      .collection("movies")
      .findOne({
        title: "Back to the Future",
      });

    return res.status(StatusResponseCode.Created).json(feed);
  }
);

/** Gets all feeds */
export const getFeed = handleControllerError("getFeed", async (req, res) => {
  return res
    .status(StatusResponseCode.Success)
    .send("Feeds fetched successfully");
});

/** Gets a feed by id */
export const getFeedById = handleControllerError(
  "getFeedById",
  async (req, res) => {
    return res
      .status(StatusResponseCode.Success)
      .send("Feed fetched successfully");
  }
);
