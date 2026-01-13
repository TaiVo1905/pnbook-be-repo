import { z } from 'zod';

export const deleteReplySchema = z.object({
  params: z.object({
    id: z.uuid('id must be a valid UUID'),
  }),
});
