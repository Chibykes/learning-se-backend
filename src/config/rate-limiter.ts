import type { Request, Response } from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../lib/redis.js';

// 2. Define a Strict Limiter (e.g., for Login/Withdrawals)
export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP/User to 10 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  // 3. Configure the Redis Store
  store: new RedisStore({
    // @ts-expect-error - Known type mismatch between ioredis and rate-limit-redis
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:strict:', // Namespace for your keys in Redis
  }),

  // 4. Custom Error Response (FinTech Polish)
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      status: 'error',
      code: 'TOO_MANY_REQUESTS',
      message: 'Security alert: Too many attempts. Please try again in 10 minutes.',
    });
  },

  // 5. Key Generator (Crucial for Mobile/CGNAT in Nigeria)
  keyGenerator: (req: Request) => {
    // If user is logged in, limit by User ID. Otherwise, use IP.
    return String(req.user?.id || ipKeyGenerator(req.ip || '') || 'unknown');
  },
});
