import dotenv from "dotenv";

export const config = {
  port: process.env.PORT || 5001,
  // jwtSecret: process.env.JWT_SECRET || your_secret_key,
  dbUrl: process.env.DATABASE_URL,
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
  },
};
