import { type Request, type Response } from "express";
import { UsersService } from "../services/users.service.js";

export class UsersController {
  private readonly usersService: UsersService;
  constructor() {
    this.usersService = new UsersService();
  }

  async getUsers(req: Request, res: Response) {
    const users = await this.usersService.getUsers();

    return res.json({
      status: "success",
      data: users,
      message: "Users retrieved successfully",
    });
  }

  async getUserById(req: Request, res: Response) {
    const user = await this.usersService.getUserById(Number(req.params.id));

    return res.json({
      status: "success",
      data: user,
      message: "User retrieved successfully",
    });
  }
}
