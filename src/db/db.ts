import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
import { handleSyncError } from "../utils/index";

/** Creates a single instance of the mongo client */
const mongoClient = handleSyncError<() => MongoClient>("mongoClient", () => {
  let clientConnection: MongoClient | undefined;

  function client() {
    if (clientConnection instanceof MongoClient) return clientConnection;
    const connectionString = process.env.DB_CONNECTION_STRING!;
    console.log("Connecting to MongoDB at", connectionString);
    clientConnection = new MongoClient(process.env.DB_CONNECTION_STRING!);
    return clientConnection;
  }

  return client;
});

export const mongoInstance = mongoClient();
