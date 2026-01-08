import { Router } from 'express';
import { usersController } from './users.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { userSchema } from './schemas/userSchema.js';

const usersRoutes = Router();

usersRoutes.get('/users/suggestions', usersController.getSuggestions);

usersRoutes.get(
  '/users/:id',
  validate(userSchema),
  usersController.getByIdWithFriendship
);

usersRoutes.get('/auth/me', usersController.getMe);

usersRoutes.patch('/users/me', usersController.updateById);

export default usersRoutes;
