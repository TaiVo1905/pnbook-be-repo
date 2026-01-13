import { Router } from 'express';
import { searchesController } from './searches.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { searchSchema } from './schemas/search.schema.js';
import { historySchema } from './schemas/history.schema.js';
import { deleteHistorySchema } from './schemas/deleteHistory.schema.js';

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
  validate(historySchema),
  searchesController.getHistory
);
searchesRoutes.delete(
  '/search-history/:id',
  validate(deleteHistorySchema),
  searchesController.deleteHistory
);
searchesRoutes.delete(
  '/search-history',
  searchesController.clearAllHistoryByUser
);

export default searchesRoutes;
