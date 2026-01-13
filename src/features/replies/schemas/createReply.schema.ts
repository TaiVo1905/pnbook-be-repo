import { z } from 'zod';

export const createReplySchema = z.object({
  body: z.object({
    commentId: z.uuid('commentId must be a valid UUID'),
    content: z.string().min(1, 'Content must be at least 1 character long'),
  }),
});
