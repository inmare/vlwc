import { fetchHtml } from './fetch';
import {
  parseSongLinks,
  parseSongListPaths,
  parsePageTitle,
  parseInfoTable,
  parseLyricsTable,
} from './parse';
import type { Page, PageData } from './types';
import * as cheerio from 'cheerio';

export default async function crawling() {
  console.log('Crawling started');
  const originUrl = 'https://vocaro.wikidot.com';
  const allsongsUrl = new URL('allsongs', originUrl);
  const allsongsHtml = await fetchHtml(allsongsUrl);
  const paths = parseSongListPaths(allsongsHtml);
  console.log(`Get ${paths.length} of sub pages in /allsongs`);

  const pages: Page[] = [];
  for (const path of paths) {
    const subPageUrl = new URL(path, originUrl);
    console.log(`Current Page: ${path}`);
    const html = await fetchHtml(subPageUrl);
    pages.push(...parseSongLinks(html));
  }

  console.log(`Get ${pages.length} of songs from sub pages`);

  const pageDatas: PageData[] = [];
  for (const page of pages) {
    console.log(`Trying to get/parse page ${page.url}`);
    const songPageUrl = new URL(page.url, originUrl);
    const html = await fetchHtml(songPageUrl);
    const $ = cheerio.load(html);
    const pageData: PageData = {
      pageTitle: parsePageTitle($),
      infoTable: parseInfoTable($),
      lyricsTable: parseLyricsTable($),
    };
    pageDatas.push(pageData);
  }
}
