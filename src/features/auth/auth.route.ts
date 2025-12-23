import { Router } from 'express';
import { register } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerSchema } from './auth.validate.js';

const authRoute = Router();

// Route: /api/v1/auth/sign-up
authRoute.post('/sign-up', validate(registerSchema), register);

export default authRoute;
