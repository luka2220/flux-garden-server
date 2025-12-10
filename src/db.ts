import { Database } from "bun:sqlite";
import { DB_FILE_PATH } from "./constants";

let db: undefined | Database;

export function getDbInstance() {
  if (!db) {
    db = new Database(DB_FILE_PATH);
  }

  return db;
}
