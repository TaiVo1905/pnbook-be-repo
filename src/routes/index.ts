import authRoutes from '@/features/auth/auth.route.js';
import { Router } from 'express';

const route = Router();

const authRoute = Router();

authRoute.use('/auth', authRoutes);

export { authRoute, route };
