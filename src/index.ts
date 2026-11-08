import * as cheerio from 'cheerio';
import { parseArgs } from 'node:util';
import { ALLSONGS_PATH, WIKI_URL } from './constants';
import { fetcher, parser } from './crawler';
import { insertPages } from './db';
import type { PageData } from './types';

const { values } = parseArgs({
  options: {
    amount: {
      type: 'string',
      short: 'a',
    },
    random: {
      type: 'boolean',
      short: 'r',
      default: true,
    },
    debug: {
      type: 'boolean',
      short: 'd',
      default: false,
    },
  },
});

const amount = values.amount === undefined ? undefined : Number(values.amount);
const isAmountPositiveInt =
  amount !== undefined && (!Number.isSafeInteger(amount) || amount <= 0);
if (isAmountPositiveInt) {
  console.error('Put positive integer in amount');
  process.exit(1);
}
const random = values.random;
const debug = values.debug;

try {
  console.log('Crawling started');

  const allsongsUrl = new URL(ALLSONGS_PATH, WIKI_URL);
  const allsongsHtml = await fetcher.fetchHtml(allsongsUrl);
  const paths = parser.getSongListPaths(allsongsHtml);
  console.log(`Get ${paths.length} of sub pages in /allsongs`);

  const pages: string[] = [];
  for (const path of paths) {
    if (debug) console.log(`Current Page: ${path}`);
    const subPageUrl = new URL(path, WIKI_URL);

    const html = await fetcher.fetchHtml(subPageUrl);
    pages.push(...parser.getSongLinks(html));
  }

  console.log(`Get ${pages.length} of songs from sub pages`);

  let finalPages: string[] = [...pages];

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
  for (const pagePath of finalPages) {
    console.log(`Trying to get/parse page ${pagePath}`);
    const songPageUrl = new URL(pagePath, WIKI_URL);
    const html = await fetcher.fetchHtml(songPageUrl);
    const $ = cheerio.load(html);
    const pageData: PageData = {
      pageTitle: parser.getPageTitle($),
      infoTable: parser.getInfoTable($),
      lyricsTable: parser.getLyricsTable($),
    };
    pageDatas.push(pageData);
    insertPages(pagePath, pageData);
  }

  if (debug) {
    console.log(pageDatas);
  }
} catch (error) {
  console.error(error);
}
