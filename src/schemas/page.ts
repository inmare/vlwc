import { z } from 'zod';
import { songSchema } from './song';

export const pageSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
  rawHtml: z.string(),
  fetchedAt: z.date(),
  parseStatus: z.enum(['pending', 'success', 'failed']),
  song: songSchema.nullable(),
});

export type PageData = z.infer<typeof pageSchema>;
