import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import postsService from './posts.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import type { CreatePostRequestDto } from './dtos/createPostRequest.dto.js';
import { POSTS_MESSAGES } from './posts.messages.js';

export const postsController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const createPostPayload: CreatePostRequestDto = {
      posterId: req.user!.id,
      content: req.body.content,
      originalPostId: req.body.originalPostId,
      attachments: req.body.attachments,
    };
    const post = await postsService.create(createPostPayload);
    const response = ApiResponse.created(POSTS_MESSAGES.POST_CREATED, post);
    return res.status(response.statusCode).json(response);
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const post = await postsService.getById(req.params.id, req.user!.id);
    const response = ApiResponse.success(POSTS_MESSAGES.POSTS_FETCHED, post);
    return res.status(response.statusCode).json(response);
  }),

  getByPoster: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const getPostPayload = {
      posterId: req.params.id,
      userId: req.user!.id,
      page,
      limit,
    };
    const { posts, count } = await postsService.getByPoster(getPostPayload);
    const response = ApiResponse.paginated(
      POSTS_MESSAGES.POSTS_FETCHED,
      posts,
      {
        currentPage: page,
        limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  getFeeds: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const getPostPayload = {
      userId: req.user!.id,
      page,
      limit,
    };
    const { posts, count } = await postsService.getFeeds(getPostPayload);
    const response = ApiResponse.paginated(
      POSTS_MESSAGES.FEEDS_FETCHED,
      posts,
      {
        currentPage: page,
        limit,
        totalItems: count,
      }
    );
    return res.status(response.statusCode).json(response);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const updatePostPayload = {
      postId: req.params.id,
      actorId: req.user!.id,
      content: req.body.content,
      attachments: req.body.attachments,
    };
    const post = await postsService.update(updatePostPayload);
    const response = ApiResponse.success(POSTS_MESSAGES.POST_UPDATED, post);
    return res.status(response.statusCode).json(response);
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const post = await postsService.remove(req.params.id, req.user!.id);
    const response = ApiResponse.success(POSTS_MESSAGES.POST_DELETED, post);
    return res.status(response.statusCode).json(response);
  }),

  listReactions: catchAsync(async (req: Request, res: Response) => {
    const reactions = await postsService.listReactions(req.params.id);
    const response = ApiResponse.success(
      POSTS_MESSAGES.REACTIONS_FETCHED,
      reactions
    );
    return res.status(response.statusCode).json(response);
  }),

  react: catchAsync(async (req: Request, res: Response) => {
    const reactionPayload = {
      postId: req.params.id,
      reactorId: req.user!.id,
    };
    const reaction = await postsService.react(reactionPayload);
    const response = ApiResponse.created(POSTS_MESSAGES.POST_REACTED, reaction);
    return res.status(response.statusCode).json(response);
  }),

  unreact: catchAsync(async (req: Request, res: Response) => {
    const reactionPayload = {
      postId: req.params.id,
      reactorId: req.user!.id,
    };
    const reaction = await postsService.unreact(reactionPayload);
    const response = ApiResponse.success(
      POSTS_MESSAGES.REACTION_REMOVED,
      reaction
    );
    return res.status(response.statusCode).json(response);
  }),
};
