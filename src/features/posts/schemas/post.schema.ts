import { z } from 'zod';
export const postSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    originalPostId: z.uuid().optional(),
    attachments: z
      .array(
        z.object({
          key: z.string().min(1),
          type: z.enum(['image', 'video', 'audio']),
        })
      )
      .optional(),
  }),
});
