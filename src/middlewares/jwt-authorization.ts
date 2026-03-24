import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { UnauthorizedError } from '../utils/errors.js';
import type { JWTPayload } from '../types/index.js';

const authService = new AuthService();
export default function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    throw new UnauthorizedError('Unauthorized. You need to login to access this resource');
  }

  try {
    const payload = authService.verifyJwtToken(accessToken);
    req.user = payload as JWTPayload;
    next();
  } catch (error) {
    throw new UnauthorizedError('Access token is invalid or expired');
  }
}
x