import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { uploadsController } from './uploads.controller.js';
import { presignedUrlSchema } from './schemas/presignedUrl.schema.js';
import { limitedTimeUrlSchema } from './schemas/limitedTimeUrl.schema.js';

const uploadsRoutes = Router();

uploadsRoutes.post(
  '/get-presigned-url',
  validate(presignedUrlSchema),
  uploadsController.getPresignedUrl
);
uploadsRoutes.post(
  '/get-limited-time-url',
  validate(limitedTimeUrlSchema),
  uploadsController.getLimitedTimeUrl
);

export default uploadsRoutes;
