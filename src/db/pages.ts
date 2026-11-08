import type { PageData } from '../types';
import { db } from './client';
import { pages } from './schema';

export function insertPages(url: string, pageData: PageData) {
  const { pageTitle, infoTable, lyricsTable } = pageData;
  db.insert(pages)
    .values({
      url,
      pageTitle,
      infoTable,
      lyricsTable,
    })
    .onConflictDoNothing({
      target: pages.url,
    })
    .run();
}
