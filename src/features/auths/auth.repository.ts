import { prisma } from '../../utils/prisma.js';

export const findEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const getUser = async (userId: number) => {
  return await prisma.user.findFirst({ where: { id: userId } });
};
