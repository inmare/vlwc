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

interface CrawlingOptions {
  amount: number | undefined;
  random: boolean;
  debug: boolean;
}

export default async function crawling({
  amount,
  random,
  debug,
}: CrawlingOptions) {
  console.log('Crawling started');
  const originUrl = 'https://vocaro.wikidot.com';
  const allsongsUrl = new URL('allsongs', originUrl);
  const allsongsHtml = await fetchHtml(allsongsUrl);
  const paths = parseSongListPaths(allsongsHtml);
  console.log(`Get ${paths.length} of sub pages in /allsongs`);

  const pages: Page[] = [];
  for (const path of paths) {
    if (debug) console.log(`Current Page: ${path}`);
    const subPageUrl = new URL(path, originUrl);

    const html = await fetchHtml(subPageUrl);
    pages.push(...parseSongLinks(html));
  }

  console.log(`Get ${pages.length} of songs from sub pages`);

  let finalPages: Page[] = [...pages];

  if (random) {
    for (let i = finalPages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalPages[i], finalPages[j]] = [finalPages[j]!, finalPages[i]!];
    }
  }

  if (amount !== undefined) {
    finalPages = finalPages.slice(0, amount);
  }

  const pageDatas: PageData[] = [];
  for (const page of finalPages) {
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

  if (debug) {
    console.log(pageDatas);
  }
}
