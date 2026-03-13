import express from "express";
import morgan from "morgan";
import compression from "compression";

import { TaskController } from "./controllers/task.controller";
import { UserController } from "./controllers/user.controller";
import { AppDataSource } from "./infrastructure/persitence/config/data-source";
import { TypeORMTaskRepository } from "./infrastructure/persitence/repositories/typeorm-task.repository";
import { authMiddleware } from "./middleware/auth.middleware";
import { roleMiddleware } from "./middleware/role.middleware";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(compression());

const taskRepository = new TypeORMTaskRepository();
const taskController = new TaskController(taskRepository);
const userController = new UserController();

app.post("/auth/login", (req, res) => userController.login(req, res));

app.post("/users", authMiddleware, roleMiddleware(["admin"]), (req, res) => userController.create(req, res));
app.get("/users", authMiddleware, roleMiddleware(["admin"]), (req, res) => userController.getAll(req, res));
app.get("/users/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) => userController.getById(req, res));
app.patch("/users/:id", authMiddleware, (req, res) => userController.update(req, res));
app.delete("/users/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) => userController.delete(req, res));

app.get("/tasks", authMiddleware, (req, res) => taskController.getAll(req, res));
app.post("/tasks", authMiddleware, (req, res) => taskController.create(req, res));
app.patch("/tasks/:id/complete", authMiddleware, (req, res) =>
  taskController.complete(req, res),
);
app.delete("/tasks/:id", authMiddleware, (req, res) => taskController.delete(req, res));

const PORT = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
