import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { statusCodes } from '@/core/statusCode.constant.js';
import searchService from './searches.service.js';
import type {
  SearchHistoryRequestDto,
  SearchRequestDto,
} from './dtos/searchRequest.dto.js';
import { SEARCHES_MESSAGES } from './searches.messages.js';

const extractSearchQuery = (req: Request) => {
  const keyword = String(req.query.keyword);
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  return { keyword, page, limit };
};

export const searchesController = {
  searchPosts: catchAsync(async (req: Request, res: Response) => {
    const searchPayload = extractSearchQuery(req);
    const searchRequest: SearchRequestDto = {
      userId: req.user!.id,
      data: searchPayload,
    };
    const { posts, count } = await searchService.searchPosts(searchRequest);
    const response = ApiResponse.paginated(
      SEARCHES_MESSAGES.POSTS_SEARCHED,
      posts,
      {
        currentPage: searchPayload.page,
        limit: searchPayload.limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  searchUsers: catchAsync(async (req: Request, res: Response) => {
    const searchPayload = extractSearchQuery(req);
    const searchRequest: SearchRequestDto = {
      userId: req.user!.id,
      data: searchPayload,
    };
    const { users, count } = await searchService.searchUsers(searchRequest);
    const response = ApiResponse.paginated(
      SEARCHES_MESSAGES.USERS_SEARCHED,
      users,
      {
        currentPage: searchPayload.page,
        limit: searchPayload.limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  getHistory: catchAsync(async (req: Request, res: Response) => {
    const searchPayload = extractSearchQuery(req);
    const searchRequest: SearchHistoryRequestDto = {
      userId: req.user!.id,
      ...searchPayload,
    };
    const { histories, count } =
      await searchService.getHistoryByUser(searchRequest);
    const response = ApiResponse.paginated(
      SEARCHES_MESSAGES.HISTORY_FETCHED,
      histories,
      {
        currentPage: searchPayload.page,
        limit: searchPayload.limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  deleteHistory: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await searchService.deleteHistoryById({
      id: String(id),
      userId: req.user!.id,
    });

    if (result.count === 0) {
      const response = new ApiResponse(
        statusCodes.NOT_FOUND,
        SEARCHES_MESSAGES.HISTORY_NOT_FOUND_OR_UNAUTHORIZED
      );
      return res.status(response.statusCode).json(response);
    }

    const response = new ApiResponse(
      statusCodes.SUCCESS,
      SEARCHES_MESSAGES.HISTORY_DELETED
    );
    return res.status(response.statusCode).json(response);
  }),

  clearAllHistoryByUser: catchAsync(async (req: Request, res: Response) => {
    await searchService.deleteAllHistoryByUser(req.user!.id);
    const response = new ApiResponse(
      statusCodes.SUCCESS,
      SEARCHES_MESSAGES.ALL_HISTORY_CLEARED
    );
    return res.status(response.statusCode).json(response);
  }),
};
