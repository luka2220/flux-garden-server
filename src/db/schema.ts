import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const feedsTable = sqliteTable('feeds', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  link: text().notNull(),
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const usersTable = sqliteTable('users', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  name: text().notNull(),
  email: text().notNull(),
});

/** Junction table for many-to-many relationship between users and feeds */
export const userFeedsTable = sqliteTable(
  'user_feeds',
  {
    userId: text('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    feedId: text('feed_id')
      .notNull()
      .references(() => feedsTable.id, { onDelete: 'cascade' }),
    subscribedAt: text('subscribed_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (t) => [primaryKey({ columns: [t.userId, t.feedId] })]
);
