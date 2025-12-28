import { z } from 'zod';

export const messageSchema = z.object({
  body: z.object({
    receiverId: z.uuid().optional(),
    content: z.string().min(1),
    contentType: z.enum(['text', 'attachment']).optional(),
  }),
});
