import { z } from "zod";

/** Body schema for creating a new feed*/
export const createFeedSchema = z.object({
  name: z.string().min(1),
  link: z.httpUrl(),
});

/** Params schema for getting a feed by id */
export const getFeedByIdSchema = z.object({
  id: z.string().min(1),
});
