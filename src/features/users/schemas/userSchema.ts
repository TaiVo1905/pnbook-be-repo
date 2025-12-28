import { z } from 'zod';

export const userSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid user ID'),
  }),
  query: z.object({
    keyword: z.string().min(1, 'Please provide something to search').optional(),
  }),
  body: z.object({
    name: z.string().min(1, 'Please provide a name').optional(),
    avatarUrl: z.string().optional(),
  }),
});
