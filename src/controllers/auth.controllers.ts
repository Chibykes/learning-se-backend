import type { Request, Response } from 'express';
import type { LoginReqBody, RegisterReqBody } from '../schemas/auth.schemas.js';
import { AuthService } from '../services/auth.service.js';
import { BadRequestError } from '../utils/errors.js';
import type { JWTPayload } from '../types/index.js';

export class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    const data: RegisterReqBody = req.body;
    const user = await this.authService.register({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (!user) {
      throw new BadRequestError('User registration failed');
    }

    return res.json({
      status: 'success',
      data: user,
      message: 'User registered successfully',
    });
  };

  login = async (req: Request, res: Response) => {
    const data: LoginReqBody = req.body;
    const user = await this.authService.login({
      email: data.email,
      password: data.password,
    });

    if (!user) {
      throw new BadRequestError('User login failed');
    }

    await this.authService.createLoginHistory({
      userId: user.id,
      browser: req.headers['user-agent'] || undefined,
      ipAddress: req.ip || undefined,
    });

    const payload: JWTPayload = { id: user.id, email: user.email };
    const accessToken = this.authService.generateJwtToken(payload, { expiresIn: '1d' }); // Change to 15m when deploying
    const refreshToken = this.authService.generateJwtToken(payload, { expiresIn: '7d' });

    return res.json({
      status: 'success',
      data: user,
      accessToken,
      refreshToken,
      message: 'User logged in successfully',
    });
  };

  passportGoogleCallback = async (req: Request, res: Response) => {
    const payload: JWTPayload = { id: req.user?.id!, email: req.user?.email! };
    const accessToken = this.authService.generateJwtToken(payload, { expiresIn: '15m' });
    const refreshToken = this.authService.generateJwtToken(payload, { expiresIn: '7d' });

    res.redirect(`https://yourfrontend.com/login-success?access_token=${accessToken}&refresh_token=${refreshToken}`);
  };

  googleSigninWithTokens = async (req: Request, res: Response) => {
    const tokens: { idToken?: string; accessToken?: string } = req.body;
    const user = await this.authService.googleSigninWithTokens(tokens);

    if (!user) {
      throw new BadRequestError('Google signin failed');
    }

    const payload: JWTPayload = { id: user.id, email: user.email };
    const accessToken = this.authService.generateJwtToken(payload, { expiresIn: '15m' });
    const refreshToken = this.authService.generateJwtToken(payload, { expiresIn: '7d' });

    return res.json({
      status: 'success',
      data: user,
      accessToken,
      refreshToken,
      message: 'Google signin successful',
    });
  };
}
