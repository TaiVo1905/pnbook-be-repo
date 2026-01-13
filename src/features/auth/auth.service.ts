import {
  generateAccessToken,
  generateRefreshToken,
} from '@/utils/token.util.js';
import userRepository from '@/shared/repositories/user.repository.js';
import refreshTokenRepository from '@/shared/repositories/refreshToken.repository.js';
import googleService from '@/infrastructure/google.service.js';
import type { AuthRequestDto } from './authRequest.dto.js';
import { BadRequestError, UnauthorizedError } from '@/core/apiError.js';
import { AUTH_MESSAGES } from './auth.messages.js';
import bcrypt from 'bcryptjs';
import { prisma } from '@/utils/prisma.js';
import socialAccountRepository from '@/shared/repositories/socialAccount.repository.js';

const generateAndStoreTokens = async (userId: string) => {
  await refreshTokenRepository.deleteAllUserRefreshTokens(userId);

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  await refreshTokenRepository.create({ userId, token: refreshToken });
  return { accessToken, refreshToken };
};
const authService = {
  signUpWithEmail: async (data: AuthRequestDto) => {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({
      name: data.name!,
      email: data.email,
      password: hashedPassword,
    });

    return user;
  },

  signInWithEmail: async (payload: AuthRequestDto) => {
    const { email, password } = payload;

    const user = await userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const { accessToken, refreshToken } = await generateAndStoreTokens(user.id);

    return { accessToken, refreshToken };
  },

  googleAuth: async (authCode: string) => {
    const userInfoResponse = await googleService.getUserInfo(authCode);

    if (!userInfoResponse?.email.includes('.passerellesnumeriques.org')) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_GOOGLE_ACCOUNT);
    }

    const user = await prisma.$transaction(async (tx) => {
      const socialAccount = await socialAccountRepository.findSocialAccount(
        {
          provider: 'google',
          providerId: userInfoResponse.sub,
        },
        tx
      );

      let user;

      if (!socialAccount) {
        user = await userRepository.upsertWithGoogleAuth(userInfoResponse, tx);

        await socialAccountRepository.create(
          {
            userId: user.id,
            provider: 'google',
            providerId: userInfoResponse.sub,
          },
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
  },

  signOut: async (userId: string): Promise<void> => {
    await refreshTokenRepository.deleteAllUserRefreshTokens(userId);
  },
};

export default authService;
