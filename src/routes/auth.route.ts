import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';
import passport from 'passport';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/passport/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/passport/google/callback',
  passport.authenticate('google', { session: false }),
  authController.passportGoogleCallback,
);
router.post('/google/signin', authController.googleSigninWithTokens);

export default router;
