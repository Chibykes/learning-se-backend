import type { User } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

export class UsersService {
  constructor() {}

  async getUsers() {
    const users = await prisma.user.findMany();
    return users;
  }

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  createUser = async (user: User) => {
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
