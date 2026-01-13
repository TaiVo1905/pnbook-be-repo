import { z } from 'zod';

export const getReactPostSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid post ID'),
  }),
  query: z.object({
    page: z.coerce.number('page must be a number').optional().default(1),
    limit: z.coerce
      .number('limit must be a number')
      .max(1000)
      .optional()
      .default(50),
  }),
});
