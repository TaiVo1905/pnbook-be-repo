import { z } from 'zod';

export const signUpWithEmailSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Full name is required'),
      email: z
        .string()
        .email('Invalid email format')
        .refine(
          (email) => email.endsWith('passerellesnumeriques.org'),
          'Email must be from passerellesnumeriques.org domain'
        ),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Password does not match',
      path: ['passwordConfirmation'],
    }),
});
