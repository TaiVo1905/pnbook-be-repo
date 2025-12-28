import authRoutes from '@/features/auth/auth.route.js';
import messagesRoutes from '@/features/messages/messages.route.js';
import notificationsRoutes from '@/features/notifications/notifications.route.js';
import uploadsRoutes from '@/features/uploads/uploads.route.js';
import { Router } from 'express';

const authRoute = Router();

authRoute.use('/', authRoutes);

const protectedRoute = Router();

protectedRoute.use('/', messagesRoutes);
protectedRoute.use('/', notificationsRoutes);
protectedRoute.use('/', uploadsRoutes);

export { authRoute, protectedRoute };
