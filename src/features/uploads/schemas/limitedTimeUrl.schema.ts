import { z } from 'zod';

export const limitedTimeUrlSchema = z.object({
  body: z.object({
    key: z.string().min(1),
  }),
});
