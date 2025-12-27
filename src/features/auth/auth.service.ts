import {
  generateAccessToken,
  generateRefreshToken,
} from '@/utils/token.util.js';
import userRepository from '@/shared/repositories/user.repository.js';
import refreshTokenRepository from '@/shared/repositories/refreshToken.repository.js';
import googleService from '@/infrastructure/google.service.js';
import type { AuthRequestDto } from './authRequest.dto.js';
import { BadRequestError, UnauthorizedError } from '@/core/apiError.js';
import bcrypt from 'bcryptjs';

const authService = () => {
  const signUpWithEmail = async (data: AuthRequestDto): Promise<void> => {
    const existingUser = await userRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new BadRequestError('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    await userRepository.createUser({
      name: data.name!,
      email: data.email,
      password: hashedPassword,
    });
  };
  const signInWithEmail = async (payload: AuthRequestDto) => {
    const { email, password } = payload;

    const user = await userRepository.findUserByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await refreshTokenRepository.deleteAllUserRefreshTokens(user.id);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();

    await refreshTokenRepository.createRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  };

  const googleAuth = async (authCode: string) => {
    const userInfoResponse = await googleService.getUserInfo(authCode);

    const user =
      await userRepository.findOrCreateUserWithGoogleAuth(userInfoResponse);

    await refreshTokenRepository.deleteAllUserRefreshTokens(user.id);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();

    await refreshTokenRepository.createRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  };

  return { signUpWithEmail, signInWithEmail, googleAuth };
};

export default authService();
