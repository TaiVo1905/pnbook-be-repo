import { z } from 'zod';

export const listNotificationRequestSchema = z.object({
  query: z.object({
    page: z.coerce.number('Page must be a number').optional().default(1),
    limit: z.coerce
      .number('Limit must be a number')
      .max(100)
      .optional()
      .default(20),
  }),
});
