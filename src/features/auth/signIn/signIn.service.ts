import { UnauthorizedError } from '@/core/apiError.js';
import { findUserByEmail } from '@/shared/repositories/user.repository.js';
import type { SignInRequestDto } from './signIn.requestDto.js';
import type { SignInResponseDto } from './signIn.responseDto.js';
import { RefreshTokenRepository } from '@/shared/repositories/refreshToken.repository.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/utils/token.utils.js';
import bcrypt from 'bcrypt';
export const signInService = async (
  payload: SignInRequestDto
): Promise<SignInResponseDto> => {
  const { email, password } = payload;

  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    throw new UnauthorizedError();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError();
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken();
  await RefreshTokenRepository().createRefreshToken(user.id, refreshToken);
  return { accessToken, refreshToken };
};
