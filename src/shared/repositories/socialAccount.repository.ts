import type { GoogleUserInfo } from '@/infrastructure/interfaces/googleUser.type.js';
import { PROVIDER } from '@/infrastructure/provider.type.js';
import { prisma } from '@/utils/prisma.js';
import type { Prisma, SocialAccount } from 'generated/prisma/index.js';

const socialAccountRepository = () => {
  const findSocialAccount = async (
    providerId: string,
    tx: Prisma.TransactionClient = prisma
  ): Promise<SocialAccount | null> => {
    return await tx.socialAccount.findUnique({
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
    userInfoResponse: GoogleUserInfo,
    tx: Prisma.TransactionClient = prisma
  ): Promise<SocialAccount> => {
    return await tx.socialAccount.create({
      data: {
        userId: userId,
        provider: PROVIDER.GOOGLE,
        providerId: userInfoResponse.sub,
      },
    });
  };

  return { findSocialAccount, createNewSocialAccount };
};

export default socialAccountRepository();
