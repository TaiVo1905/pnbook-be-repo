import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface JwtPayload {
  userId: string;
}

export const AuthUtil = {
  generateAccessToken: (userId: string): string => {
    const secret = config.jwt.accessSecretKey;

    if (!secret) {
      throw new Error('Chưa cấu hình JWT Secret Key!');
    }
    const signOptions: SignOptions = {
      expiresIn: config.jwt.accessExpiry as SignOptions['expiresIn'],
    };

    return jwt.sign({ userId } as JwtPayload, secret, signOptions);
  },
};
