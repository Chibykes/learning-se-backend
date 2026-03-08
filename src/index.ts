import express, { type Request, type Response } from "express";
import usersRouter from "./routes/users.route.js";

const PORT = 2200;

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Hello World",
  });
});
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
