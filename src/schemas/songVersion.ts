import { z } from 'zod';
import { lyricsSchema } from './lyrics';
import { songLinkSchema } from './songLink';

export const songVersionSchema = z.object({
  version: z.string().nullable(),
  links: z.array(songLinkSchema),
  creditsRaw: z.string(),
  // TODO: add more detailed credits schema
  lyrics: lyricsSchema,
});

export type SongVersionData = z.infer<typeof songVersionSchema>;
