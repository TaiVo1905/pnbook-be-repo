import type { PresignedUrlRequestDto } from '@/shared/dtos/presignedUrlRequest.dto.js';
import { awsS3Service } from '@/infrastructure/awsS3.service.js';

const uploadsService = {
  getSignedUrl: async ({ filename, mimeType }: PresignedUrlRequestDto) => {
    const { urlKey, url } = await awsS3Service.generateSignedUrl({
      filename,
      mimeType,
    });
    return { urlKey, url };
  },

  getLimitedTimeUrl: async (urlKey: string) => {
    const url = await awsS3Service.generateLimitedTimeUrl(urlKey);
    return url;
  },
};

export default uploadsService;
