import { Router } from 'express';
import { signIn } from './auth.controller.js';

const route = Router();

route.post('/signin', signIn);
export default route;
