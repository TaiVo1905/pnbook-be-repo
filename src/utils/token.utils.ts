import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '@/config/index.js';

const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return refreshToken;
};

const getRefreshTokenExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt;
};

const generateAccessToken = (id: string) => {
  return jwt.sign(
    {
      id: id,
    },
    config.jwt.secret || '',
    { expiresIn: '1h' }
  );
};

export { generateRefreshToken, getRefreshTokenExpiry, generateAccessToken };
