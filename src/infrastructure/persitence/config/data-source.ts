import "reflect-metadata";
import { DataSource } from "typeorm";
import { TaskSchema } from "../models/task.schema";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [TaskSchema],
    migrations: [],
    subscribers: [],
});
