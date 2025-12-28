import { z } from 'zod';

const createSchema = z.object({
  body: z.object({ commentId: z.string().uuid(), content: z.string().min(1) }),
});
const updateSchema = z.object({
  body: z.object({ content: z.string().min(1) }),
});

export { createSchema, updateSchema };
