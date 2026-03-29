import { Router } from 'express';
import { UsersController } from '../controllers/users.controllers.js';
import jwtAuthMiddleware from '../middlewares/jwt-authorization.js';
import { upload } from '../middlewares/multer.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateUserSchema } from '../schemas/users.schemas.js';

const router = Router();
const usersController = new UsersController();

router.get('/', jwtAuthMiddleware, usersController.getUsers);
router.get('/me', jwtAuthMiddleware, usersController.getMe);
// upload avatar
router.post(
  '/upload-avatar',
  jwtAuthMiddleware,
  // upload.fields([{ name: 'avatar', maxCount: 1 }]), // For multiple files
  // upload.single('avatar'), // For single file
  upload.single('avatar'),
  usersController.uploadAvatar,
);

router.get('/:id', usersController.getUserById);
router.get('/:id/posts', usersController.getUserByIdWithPosts);
// router.post('/', validate(createUserSchema), usersController.createUser);
router.put('/:id', validate(updateUserSchema), usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.get('/forbidden', usersController.getForbiddenUsers);

export default router;
