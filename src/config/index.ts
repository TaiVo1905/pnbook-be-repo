import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  dbUrl: process.env.DATABASE_URL,
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
  },
  jwt: {
    accessSecretKey: process.env.JWT_ACCESS_SECRET,
    refreshSecretKey: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY,
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY,
  },
};
