import { Router } from 'express';
import { validate } from '@/middlewares/validate.middleware.js';
import { friendshipsController } from './friendships.controller.js';
import {
  sendSchema,
  updateSchema,
  requesterIdParam,
} from './schemas/friendship.schemas.js';
const friendshipsRoutes = Router();

friendshipsRoutes.get('/friendships', friendshipsController.listMine);
friendshipsRoutes.get('/users/:id/friends', friendshipsController.listOfUser);
friendshipsRoutes.get(
  '/friendships/requests',
  friendshipsController.listRequests
);
friendshipsRoutes.post(
  '/friendships',
  validate(sendSchema),
  friendshipsController.sendRequest
);
friendshipsRoutes.patch(
  '/friendships/:id',
  validate(updateSchema),
  friendshipsController.updateStatus
);
friendshipsRoutes.delete('/friendships/:id', friendshipsController.remove);
friendshipsRoutes.patch(
  '/friendships/requests/:requesterId/accept',
  validate(requesterIdParam),
  friendshipsController.acceptRequest
);
friendshipsRoutes.delete(
  '/friendships/requests/:requesterId',
  validate(requesterIdParam),
  friendshipsController.rejectRequest
);

export default friendshipsRoutes;
