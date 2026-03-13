import "reflect-metadata";
import { DataSource } from "typeorm";
import { TaskSchema } from "../models/task.schema";
import { UserSchema } from "../models/user.schema";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [TaskSchema, UserSchema],
  migrations: [],
  subscribers: [],
});
