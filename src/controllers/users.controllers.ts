import { type Request, type Response } from "express";
import { UsersService } from "../services/users.service.js";
import {
  ForbiddenError
} from "../utils/errors.js";

export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  getUsers = async (req: Request, res: Response) => {
    const users = await this.usersService.getUsers();

    return res.json({
      status: "success",
      data: users,
      message: "Users retrieved successfully",
    });
  };

  getUserById = async (req: Request, res: Response) => {
    const user = await this.usersService.getUserById(Number(req.params.id));

    return res.json({
      status: "success",
      data: user,
      message: "User retrieved successfully",
    });
  };

  getScopedUsers = async (req: Request, res: Response) => {
    throw new ForbiddenError("Forbidden");
  };
}

// const userService = new UsersService();

// export const getUsers = async (req: Request, res: Response) => {
//   const users = await userService.getUsers();

//   return res.json({
//     status: "success",
//     data: users,
//     message: "Users retrieved successfully",
//   });
// };

// export const getUserById = async (req: Request, res: Response) => {
//   const user = await userService.getUserById(Number(req.params.id));

//   return res.json({
//     status: "success",
//     data: user,
//     message: "User retrieved successfully",
//   });
// };
