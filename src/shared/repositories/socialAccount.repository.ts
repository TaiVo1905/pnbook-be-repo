import type { GoogleUserInfo } from '@/infrastructure/interfaces/googleUser.type.js';
import { PROVIDER } from '@/infrastructure/provider.type.js';
import { prisma } from '@/utils/prisma.js';
import type { SocialAccount } from 'generated/prisma/index.js';

const socialAccountRepository = () => {
  const upsertSocialAccount = async (userId: string, providerId: string) => {
    await prisma.socialAccount.upsert({
      where: {
        provider_providerId: {
          provider: PROVIDER.GOOGLE,
          providerId: providerId,
        },
      },
      update: {
        userId: userId,
      },
      create: {
        userId: userId,
        provider: PROVIDER.GOOGLE,
        providerId: providerId,
      },
    });
  };

  const findSocialAccount = async (
    providerId: string
  ): Promise<SocialAccount | null> => {
    return await prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider: PROVIDER.GOOGLE,
          providerId: providerId,
        },
      },
    });
  };

  const createNewSocialAccount = async (
    userId: string,
    userInfoResponse: GoogleUserInfo
  ): Promise<SocialAccount> => {
    return await prisma.socialAccount.create({
      data: {
        userId: userId,
        provider: PROVIDER.GOOGLE,
        providerId: userInfoResponse.sub,
      },
    });
  };

  return { upsertSocialAccount, findSocialAccount, createNewSocialAccount };
};

export default socialAccountRepository();
