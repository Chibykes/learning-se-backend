import { Router } from 'express';
import { UsersController } from '../controllers/users.controllers.js';

const router = Router();
const usersController = new UsersController();

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.get('/forbidden', usersController.getForbiddenUsers);

export default router;
