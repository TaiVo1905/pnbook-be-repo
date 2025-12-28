import { Router } from 'express';
import { searchesController } from './searches.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import {
  searchSchema,
  getHistorySchema,
  deleteHistorySchema,
} from './schemas/search.schema.js';

const searchesRoutes = Router();

searchesRoutes.get(
  '/search/posts',
  validate(searchSchema),
  searchesController.searchPosts
);
searchesRoutes.get(
  '/search/users',
  validate(searchSchema),
  searchesController.searchUsers
);

searchesRoutes.get(
  '/search-history',
  validate(getHistorySchema),
  searchesController.getHistory
);
searchesRoutes.delete(
  '/search-history/:id',
  validate(deleteHistorySchema),
  searchesController.deleteHistory
);
searchesRoutes.delete('/search-history', searchesController.clearAll);

export default searchesRoutes;
