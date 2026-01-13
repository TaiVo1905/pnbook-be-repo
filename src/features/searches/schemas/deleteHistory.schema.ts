import { z } from 'zod';

export const deleteHistorySchema = z.object({
  params: z.object({
    id: z.uuid('Invalid history ID'),
  }),
});
