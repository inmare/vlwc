import * as cheerio from 'cheerio';
import { appendFile, mkdir } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';
import { parseArgs } from 'node:util';
import { ALLSONGS_PATH, WIKI_URL } from './constants';
import { fetcher, parser } from './crawler';
import { insertPages } from './db';
import type { ParsedSongVersion } from './db/schema';

interface Options {
  amount: number | undefined;
  random: boolean | undefined;
  debug: boolean | undefined;
  links: string[] | undefined;
}

function serializeError(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      cause: serializeError(value.cause),
    };
  }

  return value;
}

function parseOptions(): Options {
  const { values } = parseArgs({
    options: {
      amount: {
        type: 'string',
        short: 'a',
      },
      random: {
        type: 'boolean',
        short: 'r',
        default: false,
      },
      debug: {
        type: 'boolean',
        short: 'd',
        default: false,
      },
      links: {
        type: 'string',
        short: 'l',
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
  const links = values.links?.split(',').map((link) => link.trim());
  if (links !== undefined) {
    for (const link of links) {
      if (!link.startsWith('/') || link.startsWith('//')) {
        throw new Error(
          `Invalid song path: "${link}". Expected a path like "/song-name".`,
        );
      }
    }
  }
  return { amount, random, debug, links };
}

async function getSongPageLinks(
  amount?: number,
  random?: boolean,
): Promise<string[]> {
  const allsongsUrl = new URL(ALLSONGS_PATH, WIKI_URL);
  const allsongsHtml = await fetcher.fetchHtml(allsongsUrl);
  const paths = parser.page.getSongListPaths(allsongsHtml);
  console.log(`Get ${paths.length} of sub pages in /allsongs`);

  const pages: string[] = [];
  for (const path of paths) {
    const subPageUrl = new URL(path, WIKI_URL);

    const html = await fetcher.fetchHtml(subPageUrl);
    pages.push(...parser.page.getSongLinks(html));
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
  const { amount, random, debug, links } = parseOptions();

  console.log('Crawling started');

  const songPages =
    links !== undefined ? links : await getSongPageLinks(amount, random);

  for (const pagePath of songPages) {
    console.log(`Current page: ${pagePath}`);
    const songPageUrl = new URL(pagePath, WIKI_URL);
    try {
      const html = await fetcher.fetchHtml(songPageUrl);
      const $ = cheerio.load(html);
      const pageTitle = parser.page.getPageTitle($);
      const infoTable = parser.page.getInfoTable($);
      const lyricsTable = parser.page.getLyricsTable($);

      const originalTitle = parser.infoTable.getOriginalTitle(infoTable);
      if (debug) {
        console.log(pageTitle);
        console.log(originalTitle);
      }

      const versions = parser.page.getVersions(infoTable, lyricsTable);
      const songVersions: ParsedSongVersion[] = versions.map(
        (version, index): ParsedSongVersion => {
          if (debug)
            console.log(`Version: ${version.name}, Index: ${version.index}`);
          const links = parser.infoTable.getLinks(infoTable, index);
          const credits = parser.infoTable.getCredits(infoTable, index);
          if (debug) {
            console.log(links);
            console.log(credits);
          }
          return {
            versionIndex: version.index,
            versionName: version.name,
            songLink: links,
            credits,
          };
        },
      );

      insertPages(
        { url: songPageUrl.href, pageTitle, infoTable, lyricsTable },
        { title: pageTitle, originalTitle },
        songVersions,
      );
    } catch (error: unknown) {
      const log = {
        time: new Date().toISOString(),
        url: songPageUrl.href,
        error: serializeError(error),
      };

      await mkdir('logs', { recursive: true });

      await appendFile(
        'logs/crawl-errors.jsonl',
        JSON.stringify(log) + '\n',
        'utf8',
      );

      console.error(`Error: ${songPageUrl.href}`, error);
    } finally {
      await setTimeout(250);
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
