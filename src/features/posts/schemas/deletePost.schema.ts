import { z } from 'zod';

export const deletePostSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid post ID'),
  }),
});
