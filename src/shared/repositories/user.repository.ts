import type { GoogleUserInfo } from '@/infrastructure/interfaces/googleUser.type.js';
import { prisma } from '@/utils/prisma.js';
import type { Prisma } from 'generated/prisma/index.js';

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

  const updateUserWithGoogleAuth = async (
    userId: string,
    userInfoResponse: GoogleUserInfo,
    tx: Prisma.TransactionClient = prisma
  ) => {
    return await tx.user.update({
      where: { id: userId },
      data: {
        name: userInfoResponse.name,
        email: userInfoResponse.email,
        avatarUrl: userInfoResponse.picture,
      },
    });
  };

  const upserUserWithGoogleAuth = async (
    userInfoResponse: GoogleUserInfo,
    tx: Prisma.TransactionClient = prisma
  ) => {
    return await tx.user.upsert({
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
  };

  return {
    findUserByEmail,
    createUser,
    updateUserWithGoogleAuth,
    upserUserWithGoogleAuth,
  };
};

export default userRepository();
