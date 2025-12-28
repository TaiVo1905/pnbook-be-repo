import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { postsController } from './posts.controller.js';
import { postSchema } from './schemas/post.schema.js';

const postsRoutes = Router();

postsRoutes.post('/posts', validate(postSchema), postsController.create);
postsRoutes.get('/users/:id/posts', postsController.getByPoster);
postsRoutes.get('/feeds', postsController.getFeeds);
postsRoutes.get('/posts/:id', postsController.getById);
postsRoutes.get('/posts/:id/reactions', postsController.listReactions);
postsRoutes.patch('/posts/:id', validate(postSchema), postsController.update);
postsRoutes.delete('/posts/:id', postsController.remove);

export default postsRoutes;
