import { z } from 'zod';
import { songVersionSchema } from './songVersion';

export const songSchema = z.object({
  title: z.string(),
  originalTitle: z.string(),
  versions: z.array(songVersionSchema).min(1),
});

export type SongData = z.infer<typeof songSchema>;
