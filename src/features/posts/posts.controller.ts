import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import postsService from './posts.service.js';
import { ApiResponse } from '@/core/apiResponse.js';

export const postsController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const post = await postsService.create(
      req.user!.id,
      req.body.content,
      req.body.originalPostId,
      req.body.attachments
    );
    const response = ApiResponse.created('Post created', post);
    return res.status(response.statusCode).json(response);
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const post = await postsService.getById(req.params.id, req.user!.id);
    const response = ApiResponse.success('Post fetched', post);
    return res.status(response.statusCode).json(response);
  }),

  getByPoster: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { posts, count } = await postsService.getByPoster(
      req.params.id,
      req.user!.id,
      page,
      limit
    );
    const response = ApiResponse.paginated('Posts fetched', posts, {
      currentPage: page,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  getFeeds: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const { posts, count } = await postsService.getFeeds(
      req.user!.id,
      page,
      limit
    );
    const response = ApiResponse.paginated('Feeds fetched', posts, {
      currentPage: page,
      limit,
      totalItems: count,
    });
    return res.status(response.statusCode).json(response);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const post = await postsService.update(
      req.params.id,
      req.user!.id,
      req.body.content
    );
    const response = ApiResponse.success('Post updated', post);
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const post = await postsService.remove(req.params.id, req.user!.id);
    const response = ApiResponse.success('Post deleted', post);
    return res.status(response.statusCode).json(response);
  }),

  listReactions: catchAsync(async (req: Request, res: Response) => {
    const reactions = await postsService.listReactions(req.params.id);
    const response = ApiResponse.success('Reactions fetched', reactions);
    return res.status(response.statusCode).json(response);
  }),

  react: catchAsync(async (req: Request, res: Response) => {
    const reaction = await postsService.react(req.params.id, req.user!.id);
    const response = ApiResponse.created('Post reacted', reaction);
    return res.status(response.statusCode).json(response);
  }),

  unreact: catchAsync(async (req: Request, res: Response) => {
    const reaction = await postsService.unreact(req.params.id, req.user!.id);
    const response = ApiResponse.success('Reaction removed', reaction);
    return res.status(response.statusCode).json(response);
  }),
};
