import { prisma } from '../../utils/prisma.js';
interface CreateUserParams {
  name: string;
  email: string;
  password?: string;
}

export const createUser = async (data: CreateUserParams) => {
  return prisma.user.create({
    data,
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getAllUser = () => {
  return prisma.user.findMany();
};
