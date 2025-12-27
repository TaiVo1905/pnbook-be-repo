import type { PresignedUrlRequestDto } from './presignedUrlRequest.dto.js';
import {
  generateLimitedTimeUrl,
  generateSignedUrl,
} from '@/utils/signedUrl.util.js';

const uploadsService = () => {
  const getSignedUrl = async ({
    filename,
    mimeType,
  }: PresignedUrlRequestDto) => {
    const { key, url } = await generateSignedUrl({ filename, mimeType });
    return { key, url };
  };

  const getLimitedTimeUrl = async (key: string) => {
    const url = await generateLimitedTimeUrl(key);
    return url;
  };

  return { getSignedUrl, getLimitedTimeUrl };
};

export default uploadsService();
