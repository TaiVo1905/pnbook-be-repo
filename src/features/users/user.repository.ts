import { email } from "zod";
import { prisma } from "../../utils/prisma.js";

export const createUser = async (name: string, email: string) => {
  return prisma.user.create({
    data: {
      name,
      email,
    },
  });
};

export const findEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getAllUser = () => {
  return prisma.user.findMany();
};
