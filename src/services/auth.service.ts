import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import type { LoginReqBody, RegisterReqBody } from '../schemas/auth.schemas.js';
import { BadRequestError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/index.js';

export class AuthService {
  constructor() {}

  public verifyJwtToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET! || '');
  };

  public generateJwtToken = (payload: JWTPayload, options: jwt.SignOptions) => {
    return jwt.sign(payload, process.env.JWT_SECRET! || '', { expiresIn: '15m',  ...options });
  };

  register = async (data: RegisterReqBody) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  };

  login = async (data: LoginReqBody) => {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new BadRequestError(`User with email: ${data.email} not found`);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password || '');
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid password');
    }

    const { password, ...userInfo } = user;

    return userInfo;
  };
}
