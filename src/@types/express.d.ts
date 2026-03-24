import type { JWTPayload } from '../types/index.ts';

declare global {
  namespace Express {
    interface Request {
      // You can use your Prisma User type or a custom JWT payload type
      user?: JWTPayload;
    }
  }
}

export {};
