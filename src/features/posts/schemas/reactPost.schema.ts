import { z } from 'zod';

export const reactPostSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid post ID'),
  }),
});
