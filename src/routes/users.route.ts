import { Router } from 'express';
import { UsersController } from '../controllers/users.controllers.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createUserSchema, updateUserSchema } from '../schemas/users.schemas.js';
import jwtAuthMiddleware from '../middlewares/jwt-authorization.js';

const router = Router();
const usersController = new UsersController();

router.get('/', jwtAuthMiddleware, usersController.getUsers);
router.get('/me', jwtAuthMiddleware, usersController.getMe);
router.get('/:id', usersController.getUserById);
router.get('/:id/posts', usersController.getUserByIdWithPosts);
// router.post('/', validate(createUserSchema), usersController.createUser);
router.put('/:id', validate(updateUserSchema), usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.get('/forbidden', usersController.getForbiddenUsers);

export default router;
