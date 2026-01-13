import { z } from 'zod';

export const limitedTimeUrlSchema = z.object({
  body: z.object({
    urlKey: z.string().min(1, 'URL key is required'),
  }),
});
