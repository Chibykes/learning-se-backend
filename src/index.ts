import express, { type Request, type Response } from "express";
import usersRouter from "./routes/users.route.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { NotFoundError, UnprocessableEntityError } from "./utils/errors.js";
import morganMiddleware from "./middlewares/morgan.middleware.js";
import logger from "./utils/logger.js";

const PORT = 2200;

const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Hello World",
  });
});
app.use("/users", usersRouter);

app.all("*path", (req: Request, res: Response) => {
  throw new NotFoundError("Resource not found");
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
