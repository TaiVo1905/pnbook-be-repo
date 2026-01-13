import { z } from 'zod';

export const listConversationSchema = z.object({
  query: z.object({
    receiverId: z.uuid({ message: 'receiverId must be a valid UUID' }),
    page: z.coerce.number('Page must be a number').optional().default(1),
    limit: z.coerce.number('Limit must be a number').optional().default(50),
  }),
});
