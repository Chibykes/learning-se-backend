import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL! || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  retryStrategy: (times: number) => Math.min(times * 50, 2000), // Exponential backoff
});

redis.on('error', (err: any) => console.error('Redis Connection Error', err));

export default redis;
