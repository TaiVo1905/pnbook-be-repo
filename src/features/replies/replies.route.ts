import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { repliesController } from './replies.controller.js';
import { createReplySchema } from './schemas/createReply.schema.js';
import { updateReplySchema } from './schemas/updateReply.schema.js';
import { getRepliesSchema } from './schemas/getReplies.schema.js';
import { deleteReplySchema } from './schemas/deleteReply.schema.js';

const repliesRoutes = Router();

repliesRoutes.post(
  '/replies',
  validate(createReplySchema),
  repliesController.create
);

repliesRoutes.get(
  '/comments/:id/replies',
  validate(getRepliesSchema),
  repliesController.listByComment
);

repliesRoutes.patch(
  '/replies/:id',
  validate(updateReplySchema),
  repliesController.update
);

repliesRoutes.delete(
  '/replies/:id',
  validate(deleteReplySchema),
  repliesController.remove
);

export default repliesRoutes;
