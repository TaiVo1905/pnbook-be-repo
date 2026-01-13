import { ForbiddenError } from '@/core/apiError.js';

export const checkOwnership = (
  resourceOwnerId: string,
  actorId: string,
  resourceType: string = 'resource'
): void => {
  if (resourceOwnerId !== actorId) {
    throw new ForbiddenError(`Cannot edit others' ${resourceType}`);
  }
};

export const checkDeletePermission = (
  resourceOwnerId: string,
  actorId: string,
  resourceType: string = 'resource'
): void => {
  if (resourceOwnerId !== actorId) {
    throw new ForbiddenError(`Cannot delete others' ${resourceType}`);
  }
};
