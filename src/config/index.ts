import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  awsS3: {
    region: process.env.AWS_S3_REGION,
    accessKey: process.env.AWS_S3_ACCESS_KEY,
    secretKey: process.env.AWS_S3_SECRET_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    expiresInSecondsGet: Number(process.env.AWS_S3_EXPIRES_IN_SECONDS_GET),
    expiresInSecondsPut: Number(process.env.AWS_S3_EXPIRES_IN_SECONDS_PUT),
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB) || 0,
    tls: process.env.NODE_ENV === 'production',
  },
  digitalOcean: {
    dbCert: (process.env.DB_CA_CERT as string).replace(/\\n/g, '\n'),
  },
};
