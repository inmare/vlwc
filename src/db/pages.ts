import { db } from './client';
import {
  lyrics,
  pages,
  songs,
  songVersions,
  type ParsedPage,
  type ParsedSong,
  type ParsedSongVersion,
} from './schema';

export function insertPages(
  parsedPage: ParsedPage,
  parsedSong: ParsedSong,
  parsedSongVersions: ParsedSongVersion[],
) {
  return db.transaction((tx) => {
    const page = tx
      .insert(pages)
      .values({
        ...parsedPage,
      })
      .returning()
      .get();

    // TODO: remove composer name from pageTitle
    const song = tx
      .insert(songs)
      .values({
        ...parsedSong,
        pageId: page.id,
      })
      .returning()
      .get();

    // TODO: make multiple lyrics version if it has
    // TOOD: parse lyrics and fill content
    const lyricsInstance = tx
      .insert(lyrics)
      .values({
        content: {},
      })
      .returning()
      .get();

    parsedSongVersions.forEach((songVersion) => {
      tx.insert(songVersions)
        .values({
          ...songVersion,
          songId: song.id,
          lyricsId: lyricsInstance.id,
        })
        .run();
    });
  });
}
