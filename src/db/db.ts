import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite';

let db: undefined | BunSQLiteDatabase;

export function getDbInstance() {
  if (!db) {
    db = drizzle(process.env.DB_FILE_NAME!);
  }

  return db;
}
