import { z } from 'zod';

export const historySchema = z.object({
  query: z.object({
    page: z.coerce
      .number('page must be a number')
      .int('page must be an integer')
      .positive('page must be greater than 0')
      .optional()
      .default(1),
    limit: z.coerce
      .number('limit must be a number')
      .int('limit must be an integer')
      .positive('limit must be greater than 0')
      .max(100)
      .optional()
      .default(10),
  }),
});
