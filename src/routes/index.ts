import authRoutes from '@/features/auth/auth.route.js';
import messagesRoutes from '@/features/messages/messages.route.js';
import { Router } from 'express';

const authRoute = Router();

authRoute.use('/', authRoutes);

const protectedRoute = Router();

protectedRoute.use('/', messagesRoutes);

export { authRoute, protectedRoute };
