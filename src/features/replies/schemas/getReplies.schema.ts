import { z } from 'zod';

export const getRepliesSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid comment ID'),
  }),
  query: z.object({
    page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce
      .number()
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit cannot exceed 100')
      .default(5),
  }),
});
