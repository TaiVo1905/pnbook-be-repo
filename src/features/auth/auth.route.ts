import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { rateLimiter } from '@/middlewares/rateLimit.middleware.js';
import { googleAuthSchema } from '@/features/auth/schemas/googleAuth.schema.js';
import { signInWithEmailSchema } from './schemas/signInWithEmail.schema.js';
import { signUpWithEmailSchema } from './schemas/signUpWithEmail.schema.js';
import { authController } from './auth.controller.js';
import { authMiddleware } from '@/middlewares/auth.middleware.js';

const authRoutes = Router();

const authRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many authentication attempts, please try again later',
});

authRoutes.post(
  '/google',
  authRateLimit,
  validate(googleAuthSchema),
  authController.googleAuth
);

authRoutes.post(
  '/sign-in',
  authRateLimit,
  validate(signInWithEmailSchema),
  authController.signInWithEmail
);

authRoutes.post(
  '/sign-up',
  authRateLimit,
  validate(signUpWithEmailSchema),
  authController.signUpWithEmail
);

authRoutes.get('/sign-out', authMiddleware, authController.signOut);

export default authRoutes;
