import express from "express";
import { StatusResponseCode, ResponseMessages } from "../config/constants";

/** Handles sync errors and propogates it up the call stack */
export function handleSyncError<T>(name: string, cb: () => T) {
  try {
    return cb();
  } catch (error) {
    console.error("An error occurred in dbConnection: ", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

/** Handles any error that may occur in controller logic  */
export function handleControllerError(
  name: string,
  handler: (
    req: express.Request,
    res: express.Response
  ) => Promise<express.Response>
) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error(`Error in ${name}:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      res
        .status(StatusResponseCode.InternalServerError)
        .json({ error: ResponseMessages.ServerError });
    }
  };
}
