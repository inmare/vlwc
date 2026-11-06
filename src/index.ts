import crawling from './crawling';

try {
  await crawling();
} catch (error) {
  console.error(error);
}
