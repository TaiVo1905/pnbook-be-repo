import commentsRoutes from '@/features/comments/comments.route.js';
import authRoutes from '@/features/auth/auth.route.js';
import friendshipsRoutes from '@/features/friendships/friendships.route.js';
import messagesRoutes from '@/features/messages/messages.route.js';
import notificationsRoutes from '@/features/notifications/notifications.route.js';
import postsRoutes from '@/features/posts/posts.route.js';
import searchesRoutes from '@/features/searches/searches.route.js';
import uploadsRoutes from '@/features/uploads/uploads.route.js';
import usersRoutes from '@/features/users/users.route.js';
import { Router } from 'express';
import repliesRoutes from '@/features/replies/replies.route.js';

const authRoute = Router();

authRoute.use('/', authRoutes);

const protectedRoute = Router();

protectedRoute.use('/', usersRoutes);
protectedRoute.use('/', friendshipsRoutes);
protectedRoute.use('/', postsRoutes);
protectedRoute.use('/', searchesRoutes);
protectedRoute.use('/', commentsRoutes);
protectedRoute.use('/', repliesRoutes);
protectedRoute.use('/', notificationsRoutes);
protectedRoute.use('/', messagesRoutes);
protectedRoute.use('/', uploadsRoutes);

export { authRoute, protectedRoute };
