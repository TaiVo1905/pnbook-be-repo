import { z } from 'zod';

export const signInSchema = z.object({
  body: z.object({
    email: z.string().email('Email Invalid!'),
    password: z.string().min(8, 'Password must be at least 8 characters long!'),
  }),
});
