import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { config } from '@/config/index.js';
import { s3 } from '@/config/s3.js';
import type { PresignedUrlRequestDto } from '@/features/uploads/presignedUrlRequest.dto.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const generateLimitedTimeUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: config.awsS3.bucketName!,
    Key: key,
  });
  return await getSignedUrl(s3, command, {
    expiresIn: config.awsS3.expiresInSecondsGet,
  });
};

const generateSignedUrl = async ({
  filename,
  mimeType,
}: PresignedUrlRequestDto) => {
  const key = `private/${Date.now()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: config.awsS3.bucketName!,
    Key: key,
    ContentType: mimeType,
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: config.awsS3.expiresInSecondsPut,
  });
  return { key, url };
};

export { generateLimitedTimeUrl, generateSignedUrl };
