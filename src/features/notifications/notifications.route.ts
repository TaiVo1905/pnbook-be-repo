import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { notificationParamSchema } from './notificationParam.schema.js';

const notificationsRoutes = Router();

notificationsRoutes.get('/notifications/me', notificationsController.listMine);
notificationsRoutes.patch(
  '/notifications/:id/read',
  validate(notificationParamSchema),
  notificationsController.markAsRead
);

export default notificationsRoutes;
