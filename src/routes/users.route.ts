import { Router } from "express";
import { UsersController } from "../controllers/users.controllers.js";

const router = Router();
const usersController = new UsersController();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);

export default router;
