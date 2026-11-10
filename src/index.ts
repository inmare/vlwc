import * as cheerio from 'cheerio';
import { parseArgs } from 'node:util';
import { ALLSONGS_PATH, WIKI_URL } from './constants';
import { fetcher, parser } from './crawler';
import { insertPages } from './db';
import type { PageData } from './types';

async function getSongPageLinks(
  amount?: number,
  random?: boolean,
): Promise<string[]> {
  const allsongsUrl = new URL(ALLSONGS_PATH, WIKI_URL);
  const allsongsHtml = await fetcher.fetchHtml(allsongsUrl);
  const paths = parser.getSongListPaths(allsongsHtml);
  console.log(`Get ${paths.length} of sub pages in /allsongs`);

  const pages: string[] = [];
  for (const path of paths) {
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

  return finalPages;
}

async function main() {
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

  const amount =
    values.amount === undefined ? undefined : Number(values.amount);
  const isAmountInvalid =
    amount !== undefined && (!Number.isSafeInteger(amount) || amount <= 0);
  if (isAmountInvalid) throw new Error('Put positive integer in amount');
  const random = values.random;
  const debug = values.debug;

  console.log('Crawling started');

  const songPages = await getSongPageLinks(amount, random);

  const pageDatas: PageData[] = [];
  for (const pagePath of songPages) {
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
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
