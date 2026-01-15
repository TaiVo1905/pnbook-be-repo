import { redisService } from '@/config/redis.js';
import type { Request, Response, NextFunction } from 'express';
import { TooManyRequestsError } from '@/core/apiError.js';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

const LUA_SCRIPT = `
  local current = redis.call("INCR", KEYS[1])
  if current == 1 then
    redis.call("PEXPIRE", KEYS[1], ARGV[1])
  end
  local ttl = redis.call("PTTL", KEYS[1])
  return {current, ttl}
`;

export const rateLimiter = (options: RateLimitOptions) => {
  const { windowMs, maxRequests, message = 'Too many requests' } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let keySuffix = '';
      if (options.keyGenerator) {
        keySuffix = options.keyGenerator(req);
      } else {
        const userId = req.user?.id;

        const ip = req.ip || 'unknown-ip';

        keySuffix = userId ? `user:${userId}` : `ip:${ip}`;
        console.log('RateLimiter Key Suffix:', keySuffix);
      }

      const key = `rate_limit:${keySuffix}`;

      const [current, ttl] = (await redisService.eval(
        LUA_SCRIPT,
        1,
        key,
        windowMs.toString()
      )) as [number, number];

      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader(
        'X-RateLimit-Remaining',
        Math.max(0, maxRequests - current).toString()
      );
      res.setHeader('X-RateLimit-Reset', Date.now() + ttl);
      res.set(
        'Access-Control-Expose-Headers',
        'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset'
      );

      if (current > maxRequests) {
        throw new TooManyRequestsError(message);
      }

      next();
    } catch (error) {
      if (error instanceof TooManyRequestsError) {
        throw error;
      }
      console.error('Redis Rate Limit Error:', error);
      next();
    }
  };
};
