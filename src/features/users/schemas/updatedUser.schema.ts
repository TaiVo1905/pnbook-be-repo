import { z } from 'zod';

export const updatedUserSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Please provide a name').optional(),
      avatarUrl: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field (name or avatarUrl) must be provided',
    }),
});
