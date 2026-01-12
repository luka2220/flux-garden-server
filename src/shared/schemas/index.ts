import * as z from 'zod';

/** Zod schema for creating a new feed */
export const postFeedBodySchema = z.object({
  name: z.string().min(1),
  link: z.url(),
});

/** Type representing the posted feed json body */
export type PostFeedBody = z.infer<typeof postFeedBodySchema>;
