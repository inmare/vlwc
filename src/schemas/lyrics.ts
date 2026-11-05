import { z } from 'zod';

export const lyricsSchema = z.object({
  lyricsJson: z.json().nullable(),
  rawLyrics: z.string(),
});

export type LyricsData = z.infer<typeof lyricsSchema>;
