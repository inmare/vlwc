import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pages = sqliteTable('pages', {
  id: int().primaryKey({ autoIncrement: true }),
  url: text().notNull().unique(),
  pageTitle: text().notNull(),
  infoTable: text().notNull(),
  lyricsTable: text().notNull(),
});

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
