import { z } from 'zod';

export const updateReplySchema = z.object({
  params: z.object({ id: z.uuid('id must be a valid UUID') }),
  body: z.object({
    content: z.string().min(1, 'Content must be at least 1 character long'),
  }),
});
