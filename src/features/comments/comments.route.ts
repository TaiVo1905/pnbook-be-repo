import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { commentsController } from './comments.controller.js';
import { commentSchema } from './schemas/comment.schemas.js';

const commentsRoutes = Router();

commentsRoutes.post(
  '/comments',
  validate(commentSchema),
  commentsController.create
);
commentsRoutes.get('/posts/:id/comments', commentsController.listByPost);
commentsRoutes.patch(
  '/comments/:id',
  validate(commentSchema),
  commentsController.update
);
commentsRoutes.delete('/comments/:id', commentsController.remove);

export default commentsRoutes;
