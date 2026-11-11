import * as cheerio from 'cheerio';
import type { Credit } from '../../types';

/**
 * Get the original title from a song page's info table.
 * @param html Info table HTML from the song page.
 * @returns The first table row's text, expected to contain the original title.
 */
export function getOriginalTitle(html: string): string {
  // TODO: Check for edge cases.
  const $ = cheerio.load(html);
  const originalTitle = $('tr').first().text().trim();
  if (!originalTitle)
    throw new Error("Title is empty. Parser didn't detect text in first cell");
  return originalTitle;
}

/**
 * Get PV links from an info table for the selected version.
 * @param html Info table HTML from the song page.
 * @param versionIndex Zero-based index of the selected version.
 * @returns Links from the selected cell in the third table row.
 */
export function getLinks(html: string, versionIndex: number): string[] {
  // TODO: Check for edge cases.
  const $ = cheerio.load(html);

  const targetTd = $('tr').eq(2).find('td').eq(versionIndex);
  const links = targetTd
    .find('a')
    .map((_, element) => $(element).attr('href'))
    .get()
    .filter((href) => href !== undefined);

  if (links.length === 0)
    throw new Error(
      `Can't find link from cell ${versionIndex + 1} from third row.`,
    );

  return links;
}

/**
 * Get song credits from an info table for the selected version.
 * @param html Info table HTML from the song page.
 * @param versionIndex Zero-based index of the selected version.
 * @returns Credits containing role names and credited people.
 */
export function getCredits(html: string, versionIndex: number): Credit[] {
  // TODO: Check for edge cases.
  const $ = cheerio.load(html);

  const credits = $('tr')
    .slice(3)
    .map((_, element) => {
      const hasMultipleCredits = $(element).find('th').get().length > 1;
      const thIdx = hasMultipleCredits ? versionIndex : 0;
      const job = $(element).find('th').eq(thIdx).text().trim();
      const cell = $(element).find('td').eq(thIdx).clone();
      cell.find('br').replaceWith('\n');
      const person = cell
        .text()
        .split('\n')
        .map((name) => name.trim())
        .filter((name) => name !== '');
      const credit: Credit = {
        job,
        person,
      };
      return credit;
    })
    .get();
  if (credits.length === 0) throw new Error("Can't get credits from table.");
  return credits;
}
