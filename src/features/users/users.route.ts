import { Router } from 'express';
import { usersController } from './users.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { userSchema } from './schemas/userSchema.js';

const usersRoutes = Router();

usersRoutes.get('/users/:id', validate(userSchema), usersController.getById);
usersRoutes.patch(
  '/users/:id',
  validate(userSchema),
  usersController.updateById
);
usersRoutes.get('/users/search', validate(userSchema), usersController.search);

export default usersRoutes;
