import { type Request, type Response } from 'express';
import { UsersService } from '../services/users.service.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors.js';

export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  getMe = async (req: Request, res: Response) => {
    const user = await this.usersService.getUserById(Number(req.user?.id));
    return res.json({
      status: 'success',
      data: user,
      message: 'User retrieved successfully',
    });
  };

  getUsers = async (req: Request, res: Response) => {
    const users = await this.usersService.getUsers();

    return res.json({
      status: 'success',
      data: users,
      message: 'Users retrieved successfully',
    });
  };

  getUserById = async (req: Request, res: Response) => {
    const user = await this.usersService.getUserById(Number(req.params.id));

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return res.json({
      status: 'success',
      data: user,
      message: 'User retrieved successfully',
    });
  };

  getUserByIdWithPosts = async (req: Request, res: Response) => {
    const user = await this.usersService.getUserByIdWithPosts(Number(req.params.id));
    return res.json({
      status: 'success',
      data: user,
      message: 'User retrieved with posts successfully',
    });
  };

  createUser = async (req: Request, res: Response) => {
    console.log('Request body', req.body);
    const user = await this.usersService.createUser(req.body);
    return res.json({
      status: 'success',
      data: user,
      message: 'User created successfully',
    });
  };

  updateUser = async (req: Request, res: Response) => {
    console.log('Request body', req.body);
    const user = await this.usersService.updateUser(Number(req.params.id), req.body);
    return res.json({
      status: 'success',
      data: user,
      message: 'User updated successfully',
    });
  };

  deleteUser = async (req: Request, res: Response) => {
    await this.usersService.deleteUser(Number(req.params.id));
    return res.json({
      status: 'success',
      message: 'User deleted successfully',
    });
  };
  getForbiddenUsers = async (req: Request, res: Response) => {
    throw new ForbiddenError('Forbidden');
  };

  uploadAvatar = async (req: Request, res: Response) => {
    console.log('Request body', req.body);
    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const userId = Number(req.user?.id);
    // const avatar = (req.files as any)['avatar']?.[0]?.path.split('/public')[1];
    // const avatar = req.file?.path.split('/public')[1];
    const avatar = req.file?.path; // cloudinary upload returns the path directly
    const user = await this.usersService.updateUserAvatar(userId, avatar!);

    console.log('Request file', req.file);
    return res.json({
      status: 'success',
      data: user,
      message: 'Avatar uploaded successfully',
    });
  };
}