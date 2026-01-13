import { Router } from 'express';
import { usersController } from './users.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { updatedUserSchema } from './schemas/updatedUser.schema.js';
import { selectedUserSchema } from './schemas/selectedUser.schema.js';

const usersRoutes = Router();

usersRoutes.get('/users/suggestions', usersController.getSuggestions);

usersRoutes.get(
  '/users/:id',
  validate(selectedUserSchema),
  usersController.getById
);

usersRoutes.get('/auth/me', usersController.getMe);

usersRoutes.patch(
  '/users/me',
  validate(updatedUserSchema),
  usersController.updateById
);

export default usersRoutes;
