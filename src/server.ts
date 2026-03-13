import express from "express";
import morgan from "morgan";
import compression from "compression";

import { TaskController } from "./controllers/task.controller";
import { AppDataSource } from "./infrastructure/persitence/config/data-source";
import { TypeORMTaskRepository } from "./infrastructure/persitence/repositories/typeorm-task.repository";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(compression());

const repository = new TypeORMTaskRepository();
const taskController = new TaskController(repository);

app.get("/tasks", (req, res) => taskController.getAll(req, res));
app.post("/tasks", (req, res) => taskController.create(req, res));
app.patch("/tasks/:id/complete", (req, res) =>
  taskController.complete(req, res),
);
app.delete("/tasks/:id", (req, res) => taskController.delete(req, res));

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
