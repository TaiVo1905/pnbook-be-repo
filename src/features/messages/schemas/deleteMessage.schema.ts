import { z } from 'zod';

export const deleteMessageSchema = z.object({
  params: z.object({
    id: z.string().uuid('Message ID must be a valid UUID'),
  }),
});
