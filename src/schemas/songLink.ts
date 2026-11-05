import { z } from 'zod';

export const songLinkSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
  platform: z.string().nullable(),
});

export type SongLinkData = z.infer<typeof songLinkSchema>;
