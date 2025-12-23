import { Router } from 'express';
import authRoute from '../features/auths/auth.route.js';

const route = Router();

route.use('/auth', authRoute);

export default route;
