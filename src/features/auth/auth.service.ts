import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/util.appError.js';
import * as userRepo from '../users/user.repository.js';
import type { RegisterDto, AuthResponseDto } from './auth.dto.js';

export const registerWithEmail = async (
  data: RegisterDto
): Promise<AuthResponseDto> => {
  const existingUser = await userRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw new AppError('Email already exists', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const newUser = await userRepo.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return { id: newUser.id, name: newUser.name, email: newUser.email };
};
