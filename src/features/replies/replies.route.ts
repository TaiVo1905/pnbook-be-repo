import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { repliesController } from './replies.controller.js';
import { createSchema, updateSchema } from './schemas/reply.schema.js';

const repliesRoutes = Router();

repliesRoutes.post(
  '/replies',
  validate(createSchema),
  repliesController.create
);
repliesRoutes.get('/comments/:id/replies', repliesController.listByComment);
repliesRoutes.patch(
  '/replies/:id',
  validate(updateSchema),
  repliesController.update
);
repliesRoutes.delete('/replies/:id', repliesController.remove);

export default repliesRoutes;
