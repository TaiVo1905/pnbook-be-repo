import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
