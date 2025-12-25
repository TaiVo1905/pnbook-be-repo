import { Router } from 'express';
import { googleAuth } from '@/features/auth/google/google.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { googleAuthSchema } from '@/features/auth/google/google.validation.js';

const authRoutes = Router();
authRoutes.post('/google', validate(googleAuthSchema), googleAuth);

export default authRoutes;
