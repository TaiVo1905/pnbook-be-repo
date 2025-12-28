import { z } from 'zod';

const sendSchema = z.object({
  params: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20)),
  }),
  body: z.object({ addresseeId: z.uuid() }),
});
const updateSchema = z.object({
  body: z.object({ status: z.enum(['accepted', 'block']) }),
});
const requesterIdParam = z.object({
  params: z.object({ requesterId: z.uuid() }),
});

export { sendSchema, updateSchema, requesterIdParam };
