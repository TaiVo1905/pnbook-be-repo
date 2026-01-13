import { z } from 'zod';

export const getPostSchema = z.object({
  params: z
    .object({
      id: z.uuid('Invalid post ID'),
    })
    .optional(),
  query: z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().max(100).optional().default(20),
  }),
});
