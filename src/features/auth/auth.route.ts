import { Router } from 'express';
import { register } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerSchema } from './auth.validate.js';

const authRoute = Router();

authRoute.post('/sign-up', validate(registerSchema), register);

export default authRoute;
