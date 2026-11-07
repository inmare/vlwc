import { parseArgs } from 'node:util';
import crawling from './crawling';

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
  await crawling({
    amount,
    random,
    debug,
  });
} catch (error) {
  console.error(error);
}
