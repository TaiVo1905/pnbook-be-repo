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
import { prisma } from '@/utils/prisma.js';
import socialAccountRepository from '@/shared/repositories/socialAccount.repository.js';

const generateAndStoreTokens = async (userId: string) => {
  await refreshTokenRepository.deleteAllUserRefreshTokens(userId);

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  await refreshTokenRepository.createRefreshToken(userId, refreshToken);
  return { accessToken, refreshToken };
};
const authService = () => {
  const signUpWithEmail = async (data: AuthRequestDto): Promise<void> => {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestError('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    await userRepository.create({
      name: data.name!,
      email: data.email,
      password: hashedPassword,
    });
  };
  const signInWithEmail = async (payload: AuthRequestDto) => {
    const { email, password } = payload;

    const user = await userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const { accessToken, refreshToken } = await generateAndStoreTokens(user.id);

    return { accessToken, refreshToken };
  };

  const googleAuth = async (authCode: string) => {
    const userInfoResponse = await googleService.getUserInfo(authCode);

    const user = await prisma.$transaction(async (tx) => {
      const socialAccount = await socialAccountRepository.findSocialAccount(
        userInfoResponse.sub,
        tx
      );

      let user;

      if (!socialAccount) {
        user = await userRepository.upsertWithGoogleAuth(userInfoResponse, tx);

        await socialAccountRepository.createNewSocialAccount(
          user.id,
          userInfoResponse,
          tx
        );

        return user;
      }

      return await userRepository.updateWithGoogleAuth(
        socialAccount.userId,
        userInfoResponse,
        tx
      );
    });

    const { accessToken, refreshToken } = await generateAndStoreTokens(user.id);

    return { accessToken, refreshToken };
  };

  const signOut = async (userId: string): Promise<void> => {
    await refreshTokenRepository.deleteAllUserRefreshTokens(userId);
  };

  return { signUpWithEmail, signInWithEmail, googleAuth, signOut };
};

export default authService();
