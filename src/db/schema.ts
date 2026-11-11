import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pages = sqliteTable('pages', {
  id: int().primaryKey({ autoIncrement: true }),
  url: text().notNull().unique(),
  pageTitle: text().notNull(),
  infoTable: text().notNull(),
  lyricsTable: text().notNull(),
});

export const pagesRelations = relations(pages, ({ one }) => ({
  songs: one(songs),
}));

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type ParsedPage = NewPage;

// Each page has single song
export const songs = sqliteTable('songs', {
  id: int().primaryKey({ autoIncrement: true }),
  pageId: int()
    .notNull()
    .unique()
    .references(() => pages.id, { onDelete: 'cascade' }),
  title: text().notNull(),
  originalTitle: text().notNull(),
});

export const songsRelations = relations(songs, ({ one, many }) => ({
  page: one(pages, {
    fields: [songs.pageId],
    references: [pages.id],
  }),
  songVersions: many(songVersions),
}));

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;
export type ParsedSong = Omit<NewSong, 'pageId'>;

// Each song could have multiple versions
// Example: https://vocaro.wikidot.com/telecaster-b-boy
// Each song could have multiple versions, but could have same lyrics
// Example: https://vocaro.wikidot.com/dance-robot-dance
export const songVersions = sqliteTable('song_versions', {
  id: int().primaryKey({ autoIncrement: true }),
  songId: int()
    .notNull()
    .references(() => songs.id, { onDelete: 'cascade' }),
  lyricsId: int()
    .notNull()
    .references(() => lyrics.id, { onDelete: 'cascade' }),
  versionIndex: int().notNull(),
  versionName: text(),
  songLink: text({ mode: 'json' }),
  credits: text({ mode: 'json' }),
});

export const songVersionsRelations = relations(songVersions, ({ one }) => ({
  song: one(songs, {
    fields: [songVersions.songId],
    references: [songs.id],
  }),
  lyrics: one(lyrics, {
    fields: [songVersions.lyricsId],
    references: [lyrics.id],
  }),
}));

export type SongVersion = typeof songVersions.$inferSelect;
export type NewSongVersion = typeof songVersions.$inferInsert;
export type ParsedSongVersion = Omit<NewSongVersion, 'songId' | 'lyricsId'>;

export const lyrics = sqliteTable('lyrics', {
  id: int().primaryKey({ autoIncrement: true }),
  content: text({ mode: 'json' }),
});

export const lyricsRelations = relations(lyrics, ({ many }) => ({
  versions: many(songVersions),
}));

export type Lyrics = typeof lyrics.$inferSelect;
export type NewLyrcis = typeof lyrics.$inferInsert;
export type ParsedLyrics = NewLyrcis;
