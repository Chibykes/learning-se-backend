import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;
