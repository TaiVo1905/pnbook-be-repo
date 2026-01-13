import { z } from 'zod';

export const messageSchema = z.object({
  body: z.object({
    receiverId: z.uuid('ReceiverId must be a valid UUID').optional(),
    content: z.string().min(1, 'Content cannot be empty'),
    contentType: z.enum(['text', 'attachment']).optional(),
  }),
  query: z.object({
    page: z.coerce.number('Page must be a number').optional().default(1),
    limit: z.coerce.number('Limit must be a number').optional().default(50),
  }),
});
