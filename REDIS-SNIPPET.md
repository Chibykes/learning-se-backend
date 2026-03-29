In a FinTech environment, these aren't just "features"—they are the defensive walls of your application. Here is how you implement these patterns using `ioredis` in Node.js.

---

### 1. Session Management (The "Kill-Switch")
Instead of a stateless JWT, we store a session object in Redis. If we detect fraud, we delete the key, and the user is instantly logged out.

```typescript
import redis from './lib/redis';
import { nanoid } from 'nanoid';

// 1. Create a session on Login
export const createSession = async (userId: string, deviceDetails: string) => {
  const sessionId = nanoid(); // Secure random ID
  const sessionKey = `session:${userId}:${sessionId}`;

  const sessionData = {
    userId,
    deviceDetails,
    lastActive: new Date().toISOString(),
  };

  // Store in Redis for 24 hours
  await redis.set(sessionKey, JSON.stringify(sessionData), 'EX', 86400);
  return sessionId;
};

// 2. The "Kill-Switch" (Logout all devices)
export const logoutAllDevices = async (userId: string) => {
  const stream = redis.scanStream({ match: `session:${userId}:*` });
  
  stream.on('data', (keys) => {
    if (keys.length) redis.del(keys);
  });
};
```


---

### 2. Distributed Rate Limiting (The "Anti-Fraud Shield")
This snippet uses a "Fixed Window" counter. For a FinTech login or transaction, you want to block an IP or User ID if they exceed 5 attempts per minute.

```typescript
import { Request, Response, NextFunction } from 'express';
import redis from './lib/redis';

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const key = `rate-limit:${ip}`;
  const limit = 5;
  const windowSeconds = 60;

  const currentRequests = await redis.incr(key);

  if (currentRequests === 1) {
    await redis.expire(key, windowSeconds);
  }

  if (currentRequests > limit) {
    return res.status(429).json({ 
      error: "Too many attempts. Please try again in a minute." 
    });
  }

  next();
};
```


---

### 3. Idempotency Keys (The "Double-Charge Guard")
This middleware ensures that if a frontend retries a "Transfer" request due to a network timeout, the backend doesn't process the money move a second time.

```typescript
export const idempotencyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const idempotencyKey = req.headers['x-idempotency-key'] as string;

  if (!idempotencyKey) return next();

  const cacheKey = `idempotency:${idempotencyKey}`;
  
  // SETNX: Set if Not Exists (Atomic check)
  const isNew = await redis.set(cacheKey, 'STARTED', 'NX', 'EX', 86400);

  if (!isNew) {
    const existingResult = await redis.get(cacheKey);
    if (existingResult === 'STARTED') {
      return res.status(409).json({ message: "Request currently processing" });
    }
    return res.json(JSON.parse(existingResult!));
  }

  // Wrap res.json to cache the final result before sending
  const originalJson = res.json;
  res.json = (body) => {
    redis.set(cacheKey, JSON.stringify(body), 'EX', 86400);
    return originalJson.call(res, body);
  };

  next();
};
```


---

### FinTech Implementation Tips:
1.  **Atomic Transactions:** Notice the `SET ... NX` in the idempotency code. This is an **atomic operation**. It checks if a key exists and sets it in one single step, preventing two requests from "sneaking in" at the same time.
2.  **Graceful Failover:** In a real FinTech app, wrap these in `try/catch`. If Redis is down, you should have a fallback (like a temporary local cache or allowing the request to hit the DB) so the entire banking app doesn't go dark.
3.  **Naming Strategy:** Use colons (`:`) in your keys (e.g., `user:123:balance`). Redis GUI tools like **TablePlus** or **RedisInsight** will automatically group these into "folders" for you.

**Would you like me to show you how to write a Lua script for the Rate Limiter? (Lua scripts are the industry standard because they run even faster and more reliably inside Redis).**