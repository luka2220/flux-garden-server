import type { FeedSchemaDb } from "../types";

/** Casts and array of unknown to an array of feeds */
export function castToFeeds(d: unknown[]) {
  return d as FeedSchemaDb[];
}
