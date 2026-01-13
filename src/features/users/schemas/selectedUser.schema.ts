import { z } from 'zod';

export const selectedUserSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid user ID'),
  }),
});
