import { Router } from 'express';
import { googleAuth } from '@/features/auth/google/google.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { googleAuthSchema } from '@/features/auth/google/google.validation.js';
import { signIn } from './signIn/signIn.controller.js';
import { signInSchema } from './signIn/signIn.validate.js';

const authRoutes = Router();

authRoutes.post('/google', validate(googleAuthSchema), googleAuth);
authRoutes.post('/sign-in', validate(signInSchema), signIn);

export default authRoutes;
