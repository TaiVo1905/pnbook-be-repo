import authRoutes from '@/features/auth/auth.route.js';
import { Router } from 'express';

const authRoute = Router();

authRoute.use('/', authRoutes);

const protectedRoute = Router();

export { authRoute, protectedRoute };
