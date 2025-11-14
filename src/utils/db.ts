import { MongoClient } from "mongodb";
import { handleSyncError } from "./index";

/** Creates a single instance of the mongo client */
export function mongoClient() {
  try {
    let clientConn: MongoClient | undefined;

    function client() {
      if (clientConn instanceof MongoClient) {
        return clientConn;
      }
      clientConn = new MongoClient(process.env.DB_CONNECTION_STRING!);
      return clientConn;
    }

    return client;
  } catch (error) {
    console.error("An error occurred in dbConnection: ", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
