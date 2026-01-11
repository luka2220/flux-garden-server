import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const feedsTable = sqliteTable('feeds', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  link: text().notNull(),
  created_at: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const usersTable = sqliteTable('users', {
  id: text().primaryKey().notNull(),
  updated_at: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  created_at: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  name: text().notNull(),
  email: text().notNull(),
  refresh_token: text().notNull(),
  photo_url: text().notNull(),
});

/** Junction table for many-to-many relationship between users and feeds */
export const userFeedsTable = sqliteTable(
  'user_feeds',
  {
    user_id: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    feed_id: text('feed_id')
      .notNull()
      .references(() => feedsTable.id, { onDelete: 'cascade' }),
    subscribed_at: text('subscribed_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (t) => [primaryKey({ columns: [t.user_id, t.feed_id] })]
);
