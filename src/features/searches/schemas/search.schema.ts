import { z } from 'zod';

export const searchSchema = z.object({
  query: z.object({
    keyword: z
      .string()
      .min(1, 'Keyword is required')
      .max(100, 'Keyword must be less than 100 characters')
      .trim(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  }),
});

export const getHistorySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  }),
});

export const deleteHistorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid history ID'),
  }),
});
