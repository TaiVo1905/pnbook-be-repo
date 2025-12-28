import { z } from 'zod';
export const commentSchema = z.object({
  posterId: z.uuid().optional(),
  content: z.string().min(1),
});
