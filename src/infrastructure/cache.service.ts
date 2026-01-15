import { redisService } from '@/config/redis.js';

export class CacheService {
  private readonly DEFAULT_TTL = 3600;

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisService.get(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttl: number = this.DEFAULT_TTL
  ): Promise<void> {
    try {
      await redisService.set(key, JSON.stringify(value), ttl);
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redisService.del(key);
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const client = redisService.getClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error(`Cache invalidate pattern error for ${pattern}:`, error);
    }
  }

  generateUserKey(userId: string): string {
    return `user:${userId}`;
  }

  generateFeedKey(userId: string, page: number, limit: number): string {
    return `feed:${userId}:${page}:${limit}`;
  }

  generatePostKey(postId: string): string {
    return `post:${postId}`;
  }

  generateCommentKey(commentId: string): string {
    return `comment:${commentId}`;
  }

  generateReplyKey(replyId: string): string {
    return `reply:${replyId}`;
  }
}

export const cacheService = new CacheService();
