import type {
  CreateSocialAccountParams,
  FindBySocialIdParams,
} from '@/shared/dtos/repositories/socialAccount.repository.dto.js';
import { prisma } from '@/utils/prisma.js';
import type { Prisma, SocialAccount } from 'generated/prisma/index.js';

const socialAccountRepository = {
  findSocialAccount: async (
    findBySocialIdParams: FindBySocialIdParams,
    tx: Prisma.TransactionClient = prisma
  ): Promise<SocialAccount | null> => {
    return await tx.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider: findBySocialIdParams.provider,
          providerId: findBySocialIdParams.providerId,
        },
      },
    });
  },

  create: async (
    createSocialAccountParams: CreateSocialAccountParams,
    tx: Prisma.TransactionClient = prisma
  ): Promise<SocialAccount> => {
    return await tx.socialAccount.create({
      data: {
        userId: createSocialAccountParams.userId,
        provider: createSocialAccountParams.provider,
        providerId: createSocialAccountParams.providerId,
      },
    });
  },
};

export default socialAccountRepository;
