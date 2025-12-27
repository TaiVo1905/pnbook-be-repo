import type { GoogleUserInfo } from '@/infrastructure/interfaces/googleUser.type.js';
import { PROVIDER } from '@/infrastructure/provider.type.js';
import { prisma } from '@/utils/prisma.js';

const userRepository = () => {
  const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
  };

  const createUser = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  };

  const updateUserInfo = async (
    userId: string,
    userInfoResponse: GoogleUserInfo
  ) => {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        name: userInfoResponse.name,
        email: userInfoResponse.email,
        avatarUrl: userInfoResponse.picture,
      },
    });
  };

  const findOrCreateUserWithGoogleAuth = async (
    userInfoResponse: GoogleUserInfo
  ) => {
    return await prisma.$transaction(async (tx) => {
      const socialAccount = await tx.socialAccount.findUnique({
        where: {
          provider_providerId: {
            provider: PROVIDER.GOOGLE,
            providerId: userInfoResponse.sub,
          },
        },
      });

      let user;

      if (!socialAccount) {
        user = await tx.user.upsert({
          where: { email: userInfoResponse.email },
          update: {
            name: userInfoResponse.name,
            avatarUrl: userInfoResponse.picture,
          },
          create: {
            name: userInfoResponse.name,
            email: userInfoResponse.email,
            avatarUrl: userInfoResponse.picture,
          },
        });
        await tx.socialAccount.create({
          data: {
            userId: user.id,
            provider: PROVIDER.GOOGLE,
            providerId: userInfoResponse.sub,
          },
        });
      } else {
        user = await tx.user.update({
          where: { id: socialAccount.userId },
          data: {
            name: userInfoResponse.name,
            avatarUrl: userInfoResponse.picture,
          },
        });
      }

      return user;
    });
  };

  return {
    findUserByEmail,
    createUser,
    updateUserInfo,
    findOrCreateUserWithGoogleAuth,
  };
};

export default userRepository();
