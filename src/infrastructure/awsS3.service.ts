import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { config } from '@/config/index.js';
import { s3 } from '@/config/s3.js';
import type { PresignedUrlRequestDto } from '@/shared/dtos/presignedUrlRequest.dto.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const awsS3Service = {
  generateLimitedTimeUrl: async (key: string) => {
    const command = new GetObjectCommand({
      Bucket: config.awsS3.bucketName!,
      Key: key,
    });
    return await getSignedUrl(s3, command, {
      expiresIn: config.awsS3.expiresInSecondsGet,
    });
  },

  generateSignedUrl: async ({ filename, mimeType }: PresignedUrlRequestDto) => {
    let urlKey;
    if (filename.includes('public')) {
      urlKey = `public/${Date.now()}-${filename.slice(7, filename.length)}`;
    } else {
      urlKey = `private/${Date.now()}-${filename}`;
    }
    const command = new PutObjectCommand({
      Bucket: config.awsS3.bucketName!,
      Key: urlKey,
      ContentType: mimeType,
    });
    const url = await getSignedUrl(s3, command, {
      expiresIn: config.awsS3.expiresInSecondsPut,
    });
    return { urlKey, url };
  },
};
