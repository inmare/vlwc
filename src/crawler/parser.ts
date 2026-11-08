import * as cheerio from 'cheerio';
import type { Page } from './types';

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
export function getSongLinks(html: string): Page[] {
  const $ = cheerio.load(html);
  const links = $('ul.allsongs-list > li > a')
    .toArray()
    .map((element) => {
      const url = element.attribs.href;
      if (!url)
        throw new Error('No link is existing in selected /allsongs subpage');
      return {
        title: $(element).text().trim(),
        url,
      };
    });
  return links;
}

/**
 * get page title from song page
 * @param $ cheerio api of song page html
 * @returns page title in string
 */
export function getPageTitle($: cheerio.CheerioAPI): string {
  const pageTitle = $('#page-title').text().trim();
  if (!pageTitle) throw new Error('No page title founded in song page');

  return pageTitle;
}

/**
 * get info table from song page
 * @param $ cheerio api of song page html
 * @returns info table html in string
 */
export function getInfoTable($: cheerio.CheerioAPI): string {
  const infoTable = $('#page-content table.info-table').html();
  if (!infoTable) throw new Error('No info table founded in song page');

  // TODO: add more parsing logic when database schema is set
  return infoTable.trim();
}

/**
 * get lyrics table from song page
 * @param $ cheerio api of song page html
 * @returns lyrics table html in string
 */
export function parseLyricsTable($: cheerio.CheerioAPI): string {
  const tableWrap = $('#page-content .table-wrap');
  // If page have multiple lyrics table, it has table wrapper
  const hasTableWrap = tableWrap.length > 0;
  const lyricsTable = hasTableWrap
    ? tableWrap.html()
    : $('#page-content table.wiki-content-table').html();
  if (!lyricsTable) throw new Error('No lyrics table founded in song page');

  // TODO: add more parsing logic when database schema is set
  return lyricsTable.trim();
}
