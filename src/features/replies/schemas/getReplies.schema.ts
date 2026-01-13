import { z } from 'zod';

export const getRepliesSchema = z.object({
  query: z.object({
    commentId: z.uuid('commentId must be a valid UUID'),
    page: z.number().min(1, 'Page must be at least 1').default(1),
    limit: z
      .number()
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit cannot exceed 100')
      .default(5),
  }),
});
