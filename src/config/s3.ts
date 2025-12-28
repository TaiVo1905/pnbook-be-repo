import { S3Client } from '@aws-sdk/client-s3';
import { config } from './index.js';

export const s3 = new S3Client({
  region: config.awsS3.region!,
  credentials: {
    accessKeyId: config.awsS3.accessKey!,
    secretAccessKey: config.awsS3.secretKey!,
  },
});
