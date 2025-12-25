import { UnauthorizedError } from '@/core/apiError.js';
import { findUserByEmail } from '@/shared/repositories/user.repository.js';
import type { SignInRequestDto } from './signIn.requestDto.js';
import type { SignInResponseDto } from './signIn.responseDto.js';
import { ApiResponse } from '@/core/apiResponse.js';
import { generateAccessToken } from '@/utils/token.utils.js';

export const signInService = async (
  payload: SignInRequestDto
): Promise<ApiResponse<SignInResponseDto>> => {
  const { email, password } = payload;
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new UnauthorizedError();
  }
  const accessToken = generateAccessToken(user.id);

  return ApiResponse.success('Sign in success', {
    accessToken,
  });
};
