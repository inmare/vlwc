import * as cheerio from 'cheerio';
import type { SongVersionInfo } from '../../types';

/**
 * Get Sub Page links from `/allsongs`
 * @param html Html of `/allsongs`
 * @returns Sub Page links which contains song link
 */
export function getSongListPaths(html: string): string[] {
  const $ = cheerio.load(html);
  const pages = $('.allsongs-index-group li > a')
    .toArray()
    .map((element) => {
      const link = element.attribs.href;
      if (!link)
        throw new Error('No link is existing in selected /allsongs element');
      return link;
    });

  return pages;
}

/**
 * Get all songs links from /allsongs sub pages
 * @param html Html of sub page of `/allsongs`
 * @returns All songs links
 */
export function getSongLinks(html: string): string[] {
  const $ = cheerio.load(html);
  const links = $('ul.allsongs-list > li > a')
    .toArray()
    .map((element) => {
      const url = element.attribs.href;
      if (!url)
        throw new Error('No link is existing in selected /allsongs subpage');
      return url;
    });
  return links;
}

/**
 * get page title from song page
 * @param $ cheerio api of song page html
 * @returns page title in string
 */
export function getPageTitle($: cheerio.CheerioAPI): string {
  const pageTitle = $('.page-title').first().text().trim();
  if (!pageTitle) throw new Error('No page title founded in song page');

  return pageTitle;
}

/**
 * get info table from song page
 * @param $ cheerio api of song page html
 * @returns info table html in string
 */
export function getInfoTable($: cheerio.CheerioAPI): string {
  const infoTable = $('#page-content table.info-table')
    .first()
    .prop('outerHTML');
  if (!infoTable) throw new Error('No info table founded in song page');

  // TODO: add more parsing logic when database schema is set
  return infoTable.trim();
}

/**
 * get lyrics table from song page
 * @param $ cheerio api of song page html
 * @returns lyrics table html in string
 */
export function getLyricsTable($: cheerio.CheerioAPI): string {
  const tableWrap = $('#page-content .table-wrap');
  // If page have multiple lyrics table, it has table wrapper
  const hasTableWrap = tableWrap.length > 0;
  const lyricsTable = hasTableWrap
    ? tableWrap.prop('outerHTML')
    : $('#page-content table.wiki-content-table').first().prop('outerHTML');
  if (!lyricsTable) throw new Error('No lyrics table founded in song page');

  // TODO: add more parsing logic when database schema is set
  return lyricsTable.trim();
}

/**
 * Get version info from a song page's lyrics HTML.
 * @param infoTableHtml Info table HTML from the song page.
 * @param lyricsTableHtml Lyrcis table HTML from the song page.
 * @returns Version names, or null if no table wrapper is present.
 */
export function getVersions(
  infoTableHtml: string,
  lyricsTableHtml: string,
): SongVersionInfo[] {
  // TODO: Check for edge cases.
  const $infoTable = cheerio.load(infoTableHtml);
  const $lyricsTable = cheerio.load(lyricsTableHtml);

  // Multiple versions could have multiple lyrics and it's version name
  const tableWrap = $lyricsTable('.table-wrap');
  const hasTableWrap = tableWrap.length > 0;
  if (hasTableWrap) {
    const versions = $lyricsTable('h2')
      .map((index, element) => {
        return { name: $lyricsTable(element).text().trim(), index: index };
      })
      .get();
    if (versions.length === 0) throw new Error('versions array is empty.');
    return versions;
  }

  // Even if lyrics table don't have multiple lyrics, it could have multiple versions in info table.
  const versionCount = $infoTable('tr')
    .get()
    .slice(1)
    .map((element) => {
      const cells = $infoTable(element).children();
      return Math.max(cells.filter('th').length, cells.filter('td').length);
    })
    .reduce((prev, curr) => {
      return Math.max(prev, curr);
    });

  return Array.from({ length: versionCount }, (_, index) => ({
    name: null,
    index,
  }));
}
