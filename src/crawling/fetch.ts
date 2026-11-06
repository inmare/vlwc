import got from 'got';

export async function fetchHtml(url: URL): Promise<string> {
  const html = await got(url, {
    timeout: {
      request: 10_000,
    },
    retry: {
      limit: 2,
    },
  }).text();

  return html;
}
