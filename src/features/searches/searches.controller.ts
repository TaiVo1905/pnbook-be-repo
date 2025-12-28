import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import searchHistoryRepository from '@/shared/repositories/searchHistory.repository.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import searchService from './searches.service.js';

export const searchesController = {
  searchPosts: catchAsync(async (req: Request, res: Response) => {
    // Schema validation ensures these values exist and are valid
    const keyword = String(req.query.keyword);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const { posts, count } = await searchService.searchPosts(
      req.user!.id,
      keyword,
      page,
      limit
    );
    const response = ApiResponse.paginated('Posts searched', posts, {
      currentPage: page,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  searchUsers: catchAsync(async (req: Request, res: Response) => {
    const keyword = String(req.query.keyword);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const { users, count } = await searchService.searchUsers(
      req.user!.id,
      keyword,
      page,
      limit
    );
    const response = ApiResponse.paginated('Users searched', users, {
      currentPage: page,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  getHistory: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { histories, count } = await searchHistoryRepository.getByUser(
      req.user!.id,
      page,
      limit
    );
    const response = ApiResponse.paginated(
      'Search history fetched',
      histories,
      {
        currentPage: page,
        limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  deleteHistory: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await searchHistoryRepository.deleteById(id, req.user!.id);

    if (result.count === 0) {
      const response = new ApiResponse(
        statusCodes.NOT_FOUND,
        'Search history not found or unauthorized'
      );
      return res.status(response.statusCode).json(response);
    }

    const response = new ApiResponse(
      statusCodes.SUCCESS,
      'Search history deleted'
    );
    return res.status(response.statusCode).json(response);
  }),

  clearAll: catchAsync(async (req: Request, res: Response) => {
    await searchHistoryRepository.deleteAllByUser(req.user!.id);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      'All search history cleared'
    );
    return res.status(response.statusCode).json(response);
  }),
};
