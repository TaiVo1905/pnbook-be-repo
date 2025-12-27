import { z } from 'zod';

export const listConversationSchema = z.object({
  query: z.object({
    receiverId: z.uuid({ message: 'receiverId must be a valid UUID' }),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
