import type { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync.js';
import uploadsService from './uploads.service.js';
import { ApiResponse } from '@/core/apiResponse.js';
import type { PresignedUrlRequestDto } from '@/shared/dtos/presignedUrlRequest.dto.js';
import type { LimitedTimeUrlRequestDto } from '@/shared/dtos/limitedTImeUrlRequest.dto.js';
import { UPLOADS_MESSAGES } from './uploads.messages.js';

export const uploadsController = {
  getPresignedUrl: catchAsync(async (req: Request, res: Response) => {
    const presignedUrlRequest: PresignedUrlRequestDto = {
      filename: req.body.filename,
      mimeType: req.body.mimeType,
    };
    const { urlKey, url } =
      await uploadsService.getSignedUrl(presignedUrlRequest);
    const response = ApiResponse.success(UPLOADS_MESSAGES.UPLOAD_URL_CREATED, {
      urlKey,
      url,
    });
    return res.status(response.statusCode).json(response);
  }),

  getLimitedTimeUrl: catchAsync(async (req: Request, res: Response) => {
    const { urlKey }: LimitedTimeUrlRequestDto = req.body;
    const url = await uploadsService.getLimitedTimeUrl(urlKey);
    const response = ApiResponse.success(
      UPLOADS_MESSAGES.LIMITED_TIME_URL_FETCHED,
      { url }
    );
    return res.status(response.statusCode).json(response);
  }),
};
