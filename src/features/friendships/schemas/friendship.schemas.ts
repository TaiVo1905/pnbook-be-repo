import { z } from 'zod';

const sendSchema = z.object({
  body: z.object({ addresseeId: z.uuid() }),
});
const updateSchema = z.object({
  body: z.object({ status: z.enum(['accepted', 'block']) }),
});
const requesterIdParam = z.object({
  params: z.object({ requesterId: z.uuid() }),
});

export { sendSchema, updateSchema, requesterIdParam };
