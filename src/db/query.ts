import { and, asc, eq, gt, like, or } from 'drizzle-orm';
import { db } from './client';
import { songs, songVersions } from './schema';

export function listSongs(afterId: number, limit: number) {
  return db
    .select({
      id: songs.id,
      title: songs.title,
      originalTitle: songs.originalTitle,
    })
    .from(songs)
    .where(gt(songs.id, afterId))
    .orderBy(asc(songs.id))
    .limit(limit)
    .all();
}

export function searchSongs(
  query: string,
  afterId: number,
  limit: number,
  linkId?: string,
) {
  return db
    .select({
      id: songs.id,
      title: songs.title,
      originalTitle: songs.originalTitle,
    })
    .from(songs)
    .innerJoin(songVersions, eq(songVersions.songId, songs.id))
    .where(
      and(
        gt(songs.id, afterId),
        or(
          like(songs.title, `%${query}%`),
          like(songs.originalTitle, `%${query}%`),
          like(songVersions.songLink, `%${linkId}%`),
        ),
      ),
    )
    .orderBy(asc(songs.id))
    .limit(limit)
    .all();
}

export function getSongFromId(id: number) {
  return db.query.songs
    .findFirst({
      where: eq(songs.id, id),
      with: {
        songVersions: {
          orderBy: (versions, { asc }) => [
            asc(versions.versionIndex),
            asc(versions.id),
          ],
          with: { lyrics: true },
        },
      },
    })
    .sync();
}
