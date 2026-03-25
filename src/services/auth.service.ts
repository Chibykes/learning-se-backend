import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import type { LoginReqBody, RegisterReqBody } from '../schemas/auth.schemas.js';
import { BadRequestError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/index.js';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

export class AuthService {
  constructor() {}

  public verifyJwtToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET! || '');
  };

  public generateJwtToken = (payload: JWTPayload, options: jwt.SignOptions) => {
    return jwt.sign(payload, process.env.JWT_SECRET! || '', { expiresIn: '15m', ...options });
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

  googleSigninWithTokens = async (tokens: { idToken?: string; accessToken?: string }) => {
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { idToken, accessToken } = tokens;

    try {
      const profile = {
        id: '',
        email: '',
        name: '',
        picture: '',
      };

      // Use idToken if available
      if (idToken) {
        const ticket = await googleClient.verifyIdToken({
          idToken: idToken!,
          audience: process.env.GOOGLE_CLIENT_ID!,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new BadRequestError('Invalid IdToken');

        // Google's unique user ID is 'sub', and we get their 'email'
        const { sub, email, name, picture } = payload;
        profile.id = sub;
        profile.email = email!;
        profile.name = name!;
        profile.picture = picture!;
      }

      // Use accessToken if idToken is not available
      else if (accessToken) {
        const tokenInfo = await googleClient.getTokenInfo(accessToken!);
        if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
          throw new BadRequestError('Invalid access token');
        }

        // You can do it this way below:

        // // 1. Set the token on your client
        // googleClient.setCredentials({ access_token: accessToken });

        // // 2. Initialize the OAuth2 service
        // const oauth2 = google.oauth2({
        //   auth: googleClient,
        //   version: 'v2',
        // });

        // // 3. Fetch the user's info
        // const { data } = await oauth2.userinfo.get();

        // profile.id = data.id!;
        // profile.email = data.email!;
        // profile.name = data.name!;
        // profile.picture = data.picture!;

        // After validating with getTokenInfo...
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        const responseJson: {
          sub: string;
          name: string;
          given_name: string;
          family_name: string;
          picture: string;
          email: string;
          email_verified: true;
        } = await response.json();

        profile.id = responseJson.sub;
        profile.email = responseJson.email;
        profile.name = responseJson.name;
        profile.picture = responseJson.picture;
      }

      let user;
      user = await prisma.user.findUnique({
        where: {
          email: profile.email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.email,
            name: profile.name,
            googleId: profile.id,
          },
        });
      }

      return user;
    } catch (error: any) {
      throw new BadRequestError(error?.message || 'Invalid token');
    }
  };

  createLoginHistory = async (payload: {
    userId: number;
    browser?: string | undefined;
    ipAddress?: string | undefined;
  }) => {
    const loginSession = await prisma.loginHistory.create({
      data: {
        userId: payload.userId,
        browser: payload.browser || null,
        ipAddress: payload.ipAddress || null,
      },
    });

    return loginSession;
  };
}
