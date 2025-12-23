import bcrypt from 'bcrypt';
import { AppError } from '../../utils/util.appError.js';
import { findEmail } from './auth.repository.js';
import { AuthUtil } from '../../utils/util.auth.js';
import type { SignInRequestDto } from './auth-request.dto.js';
import type { SignInResponseDto, UserResponeDto } from './auth-respone.dto.js';

export const signInService = async (
  payload: SignInRequestDto
): Promise<SignInResponseDto> => {
  const { email, password } = payload;

  if (!email || !email.includes('@')) {
    throw new AppError(
      'Dữ liệu đầu vào không hợp lệ',
      400,
      'VALIDATION_FAILED',
      [{ field: 'email', message: 'Email không đúng định dạng', value: email }]
    );
  }

  const user = await findEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401, 'AUTH_FAILED');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401, 'AUTH_FAILED');
  }

  const accessToken = AuthUtil.generateAccessToken(String(user.id));
  const userResp: UserResponeDto = {
    id: String(user.id),
    username: user.name || '',
    email: user.email,
  };

  return {
    status: 'Success',
    code: 2000,
    message: 'Sign in success',
    accessToken,
    user: userResp,
  };
};
