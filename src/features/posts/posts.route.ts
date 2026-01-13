import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { postsController } from './posts.controller.js';
import { postSchema } from './schemas/post.schema.js';
import { getPostSchema } from './schemas/getPost.schema.js';
import { getReactPostSchema } from './schemas/getReactPost.schema.js';
import { reactPostSchema } from './schemas/reactPost.schema.js';
import { deletePostSchema } from './schemas/deletePost.schema.js';

const postsRoutes = Router();

postsRoutes.post('/posts', validate(postSchema), postsController.create);
postsRoutes.get(
  '/users/:id/posts',
  validate(getPostSchema),
  postsController.getByPoster
);
postsRoutes.get('/feeds', postsController.getFeeds);
postsRoutes.get('/posts/:id', validate(getPostSchema), postsController.getById);
postsRoutes.get(
  '/posts/:id/reactions',
  validate(getReactPostSchema),
  postsController.listReactions
);
postsRoutes.post(
  '/posts/:id/react',
  validate(reactPostSchema),
  postsController.react
);
postsRoutes.delete(
  '/posts/:id/react',
  validate(reactPostSchema),
  postsController.unreact
);
postsRoutes.patch('/posts/:id', validate(postSchema), postsController.update);
postsRoutes.delete(
  '/posts/:id',
  validate(deletePostSchema),
  postsController.remove
);

export default postsRoutes;
