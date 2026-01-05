import { z } from 'zod';
export const commentSchema = z.object({
  body: z.object({
    postId: z.uuid().optional(),
    content: z.string().min(1),
  }),
});
