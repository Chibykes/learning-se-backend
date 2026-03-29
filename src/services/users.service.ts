import type { User } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import { ConflictError } from '../utils/errors.js';

export class UsersService {
  constructor() {}

  async getUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async getUserById(id: number) {
    if (!id) {
      throw new Error('User ID is required');
    }
    
    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });
    return user;
  }

  async getUserByIdWithPosts(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        // Include posts in the response
        // posts: true
        // Select only the fields we need from the posts
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            published: true,
            // author: true,
          },
        },
      }, // Include posts in the response
    });
    return user;
  }

  async updateUserAvatar(id: number, avatar: string) {
    if (!id) {
      throw new Error('User ID is required');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { avatar },
    });
    return updatedUser;
  }

  createUser = async (user: User) => {
    const isEmailExists = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (isEmailExists) {
      throw new ConflictError('Email already exists');
    }

    const newUser = await prisma.user.create({
      data: user,
    });
    return newUser;
  };

  updateUser = async (id: number, user: User) => {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: user,
    });
    return updatedUser;
  };

  deleteUser = async (id: number) => {
    await prisma.user.delete({
      where: { id },
    });
    return;
  };
}
