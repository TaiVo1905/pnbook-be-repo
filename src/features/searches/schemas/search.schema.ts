import { z } from 'zod';

export const searchSchema = z.object({
  query: z.object({
    keyword: z
      .string()
      .min(1, 'Keyword is required')
      .max(100, 'Keyword must be less than 100 characters')
      .trim(),

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
      .default(20),
  }),
});
