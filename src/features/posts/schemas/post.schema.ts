import { z } from 'zod';
export const postSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, 'Content is required')
      .max(50000, 'Content is too long'),
    originalPostId: z.uuid().optional(),
    attachments: z
      .array(
        z.object({
          attachmentUrl: z.string().min(1),
          attachmentType: z.enum(['image', 'video', 'audio']),
        })
      )
      .max(10, 'Attachments cannot exceed 10 items')
      .optional(),
  }),
});
