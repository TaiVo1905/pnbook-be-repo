import { z } from 'zod';

export const presignedUrlSchema = z.object({
  body: z.object({
    filename: z.string().min(1, 'Filename is required'),
    mimeType: z.string().min(1, 'MIME type is required'),
  }),
});
