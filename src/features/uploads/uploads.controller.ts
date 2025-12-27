import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import uploadsService from './uploads.service.js';
import { ApiResponse } from '@/core/apiResponse.js';

export const uploadsController = {
  getPresignedUrl: catchAsync(async (req: Request, res: Response) => {
    const { key, url } = await uploadsService.getSignedUrl({
      filename: req.body.filename,
      mimeType: req.body.mimeType,
    });
    const response = ApiResponse.success('Upload URL created', { key, url });
    return res.status(response.statusCode).json(response);
  }),

  getLimitedTimeUrl: catchAsync(async (req: Request, res: Response) => {
    const { key } = req.body;
    const url = await uploadsService.getLimitedTimeUrl(key);
    const response = ApiResponse.success('Limited Time URL fetched', { url });
    return res.status(response.statusCode).json(response);
  }),
};
