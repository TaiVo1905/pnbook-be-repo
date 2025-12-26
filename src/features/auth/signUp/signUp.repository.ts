import { prisma } from '@/utils/prisma.js';

export const createUser = async (data: {
  name: string;
  email: string;
  password?: string;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });
};
