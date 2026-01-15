import { createClient, type RedisClientType } from 'redis';
import { config } from '@/config/index.js';

class RedisService {
  private client: RedisClientType | null = null;
  private pubClient: RedisClientType | null = null;
  private subClient: RedisClientType | null = null;

  async connect(): Promise<void> {
    if (this.client?.isOpen) {
      return;
    }

    this.client = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
        ...(config.redis.tls && {
          tls: true,
          rejectUnauthorized: false,
        }),
        reconnectStrategy: (retries: number) => Math.min(retries * 50, 500),
        connectTimeout: 10000,
        keepAlive: true,
      },
      username: config.redis.username,
      password: config.redis.password,
      database: config.redis.db,
    });

    await this.client.connect();

    this.pubClient = this.client.duplicate();
    this.subClient = this.client.duplicate();

    this.pubClient.on('error', (err) =>
      console.error('Redis Pub Client Error:', err)
    );
    this.subClient.on('error', (err) =>
      console.error('Redis Sub Client Error:', err)
    );

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
  }

  async disconnect(): Promise<void> {
    await Promise.all([
      this.client?.quit(),
      this.pubClient?.quit(),
      this.subClient?.quit(),
    ]);
  }

  getClient(): RedisClientType {
    if (!this.client?.isOpen) {
      throw new Error('Redis client not connected');
    }
    return this.client;
  }

  getPubClient(): RedisClientType {
    if (!this.pubClient?.isOpen) {
      throw new Error('Redis pub client not connected');
    }
    return this.pubClient;
  }

  getSubClient(): RedisClientType {
    if (!this.subClient?.isOpen) {
      throw new Error('Redis sub client not connected');
    }
    return this.subClient;
  }

  async get(key: string): Promise<string | null> {
    return await this.getClient().get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<string | null> {
    if (ttl) {
      return await this.getClient().setEx(key, ttl, value);
    }
    return await this.getClient().set(key, value);
  }

  async del(key: string): Promise<number> {
    return await this.getClient().del(key);
  }

  async incr(key: string): Promise<number> {
    return await this.getClient().incr(key);
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    return (await this.getClient().expire(key, seconds)) === 1;
  }

  async exists(key: string): Promise<number> {
    return await this.getClient().exists(key);
  }

  async publish(channel: string, message: string): Promise<number> {
    return await this.getPubClient().publish(channel, message);
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void
  ): Promise<void> {
    await this.getSubClient().subscribe(channel, callback);
  }

  async eval(
    script: string,
    numKeys: number,
    key: string,
    arg: string
  ): Promise<any> {
    return this.getClient().eval(script, {
      keys: [key],
      arguments: [arg],
    });
  }
}

export const redisService = new RedisService();
