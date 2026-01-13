import { z } from 'zod';

export const reactPostSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid post ID'),
  }),
  body: z.object({
    reactorId: z.uuid('Invalid reactor ID'),
  }),
});
