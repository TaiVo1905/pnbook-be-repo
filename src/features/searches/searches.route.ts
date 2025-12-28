import { Router } from 'express';
import { searchesController } from './searches.controller.js';

const searchesRoutes = Router();

searchesRoutes.get('/search/posts', searchesController.searchPosts);
searchesRoutes.get('/search/users', searchesController.searchUsers);

searchesRoutes.get('/search-history', searchesController.getHistory);
searchesRoutes.delete('/search-history/:id', searchesController.deleteHistory);
searchesRoutes.delete('/search-history', searchesController.clearAll);

export default searchesRoutes;
