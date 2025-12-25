import { googleClient } from '@/config/google.js';
import type { GoogleUserInfo } from './googleUser.type.js';

import {
  generateAccessToken,
  generateRefreshToken,
} from '@/utils/token.utils.js';
import { GoogleRepository } from './google.repository.js';
import { UserRepository } from '@/shared/repositories/user.repository.js';
import { RefreshTokenRepository } from '@/shared/repositories/refreshToken.repository.js';

export const googleService = async (authCode: string) => {
  const { tokens } = await googleClient.getToken(authCode);
  googleClient.setCredentials(tokens);

  const userInfoResponse: GoogleUserInfo = (
    await googleClient.request<GoogleUserInfo>({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    })
  ).data;

  const socialAccount =
    await GoogleRepository().findSocialAccount(userInfoResponse);
  let userId: string;

  if (!socialAccount) {
    const newUser = await GoogleRepository().createNewUser(userInfoResponse);
    userId = newUser.id;
  } else {
    await UserRepository().updateUserInfo(socialAccount, userInfoResponse);
    userId = socialAccount.userId;
  }

  const accessToken = generateAccessToken(userId);

  const refreshToken = generateRefreshToken();
  await RefreshTokenRepository().createRefreshToken(userId, refreshToken);

  return { accessToken, refreshToken };
};
