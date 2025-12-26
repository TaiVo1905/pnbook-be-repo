import { googleClient } from '@/config/google.js';
import type { GoogleUserInfo } from '@/infrastructure/interfaces/googleUser.type.js';

const googleService = () => {
  const getUserInfo = async (authCode: string) => {
    const { tokens } = await googleClient.getToken(authCode);
    googleClient.setCredentials(tokens);
    const userInfoResponse: GoogleUserInfo = (
      await googleClient.request<GoogleUserInfo>({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      })
    ).data;
    return userInfoResponse;
  };
  return { getUserInfo };
};

export default googleService();
