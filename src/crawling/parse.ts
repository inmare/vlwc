import * as cheerio from 'cheerio';
import type { Page } from './types';

/**
 * Get Sub Page links from `/allsongs`
 * @param html Html of `/allsongs`
 * @returns Sub Page links which contains song link
 */
export function parseSongListPaths(html: string): string[] {
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
export function parseSongLinks(html: string): Page[] {
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
