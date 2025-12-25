import { prisma } from '@/utils/prisma.js';
import type { GoogleUserInfo } from './googleUser.type.js';
import type { User } from 'generated/prisma/client.js';
import { PROVIDER } from '../provider.type.js';

export const GoogleRepository = () => {
  const createNewUser = async (
    userInfoResponse: GoogleUserInfo
  ): Promise<User> => {
    return await prisma.user.create({
      data: {
        name: userInfoResponse.name,
        email: userInfoResponse.email,
        avatarUrl: userInfoResponse.picture,
        socialAccounts: {
          create: {
            provider: PROVIDER.GOOGLE,
            providerId: userInfoResponse.sub,
          },
        },
      },
    });
  };

  const findSocialAccount = async (userInfoResponse: GoogleUserInfo) => {
    return await prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider: PROVIDER.GOOGLE,
          providerId: userInfoResponse.sub,
        },
      },
    });
  };
  return { createNewUser, findSocialAccount };
};
