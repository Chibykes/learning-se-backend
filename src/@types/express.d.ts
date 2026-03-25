import type { JWTPayload } from '../types/index.ts';

declare global {
  namespace Express {
    // You can use your Prisma User type or a custom JWT payload type
    interface User extends JWTPayload {}
  }
}

export {};
