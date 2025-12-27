import { z } from 'zod';

export const presignedUrlSchema = z.object({
  body: z.object({
    filename: z.string().min(1),
    mimeType: z.string().min(1),
  }),
});
