import bcrypt from 'bcryptjs';
import { BadRequestError } from '@/core/apiError.js'; // Sử dụng ApiError có sẵn
import * as userRepo from '@/features/users/user.repository.js';
import type { RegisterDto, AuthResponseDto } from './signUp.dto.js';

export const registerWithEmail = async (
  data: RegisterDto
): Promise<AuthResponseDto> => {
  const existingUser = await userRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw new BadRequestError('Email already exists'); //
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const newUser = await userRepo.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };
};
