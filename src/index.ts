import * as cheerio from 'cheerio';
import { parseArgs } from 'node:util';
import { ALLSONGS_PATH, WIKI_URL } from './constants';
import { fetcher, parser } from './crawler';

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

interface CrawlerPage {
  title: string;
  url: string;
}

interface CrawlerPageData {
  pageTitle: string;
  infoTable: string;
  lyricsTable: string;
}

try {
  console.log('Crawling started');

  const allsongsUrl = new URL(ALLSONGS_PATH, WIKI_URL);
  const allsongsHtml = await fetcher.fetchHtml(allsongsUrl);
  const paths = parser.getSongListPaths(allsongsHtml);
  console.log(`Get ${paths.length} of sub pages in /allsongs`);

  const pages: CrawlerPage[] = [];
  for (const path of paths) {
    if (debug) console.log(`Current Page: ${path}`);
    const subPageUrl = new URL(path, WIKI_URL);

    const html = await fetcher.fetchHtml(subPageUrl);
    pages.push(...parser.getSongLinks(html));
  }

  console.log(`Get ${pages.length} of songs from sub pages`);

  let finalPages: CrawlerPage[] = [...pages];

  if (random) {
    for (let i = finalPages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalPages[i], finalPages[j]] = [finalPages[j]!, finalPages[i]!];
    }
  }

  if (amount !== undefined) {
    finalPages = finalPages.slice(0, amount);
  }

  const pageDatas: CrawlerPageData[] = [];
  for (const page of finalPages) {
    console.log(`Trying to get/parse page ${page.url}`);
    const songPageUrl = new URL(page.url, WIKI_URL);
    const html = await fetcher.fetchHtml(songPageUrl);
    const $ = cheerio.load(html);
    const pageData: CrawlerPageData = {
      pageTitle: parser.getPageTitle($),
      infoTable: parser.getInfoTable($),
      lyricsTable: parser.parseLyricsTable($),
    };
    pageDatas.push(pageData);
  }

  if (debug) {
    console.log(pageDatas);
  }
} catch (error) {
  console.error(error);
}
