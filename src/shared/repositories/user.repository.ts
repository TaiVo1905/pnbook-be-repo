import type { GoogleUserInfo } from '@/features/auth/google/googleUser.type.js';
import { prisma } from '@/utils/prisma.js';
import type { SocialAccount } from 'generated/prisma/index.js';

export const UserRepository = () => {
  const updateUserInfo = async (
    socialAccount: SocialAccount,
    userInfoResponse: GoogleUserInfo
  ) => {
    await prisma.user.update({
      where: { id: socialAccount.userId },
      data: {
        name: userInfoResponse.name,
        email: userInfoResponse.email,
        avatarUrl: userInfoResponse.picture,
      },
    });
  };

  return { updateUserInfo };
};
