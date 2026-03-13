import { Request, Response } from "express";
import { TaskRepository } from "../domain/repositories/task.repository";
import { GetTaskUseCase } from "../domain/use-cases/task/get-task.use-case";
import { CreateTaskUseCase } from "../domain/use-cases/task/create-task.use-case";
import { CompleteTaskUseCase } from "../domain/use-cases/task/complete-task.use-case";
import { DeleteTaskUseCase } from "../domain/use-cases/task/delete-task.use-case";

export class TaskController {

    private repository: TaskRepository
    private getTaskUseCase: GetTaskUseCase
    private createTaskUseCase: CreateTaskUseCase
    private completeTaskUseCase: CompleteTaskUseCase
    private deleteTaskUseCase: DeleteTaskUseCase

    constructor(repository: TaskRepository){
        this.repository = repository
        this.getTaskUseCase = new GetTaskUseCase(repository)
        this.createTaskUseCase = new CreateTaskUseCase(repository)
        this.completeTaskUseCase = new CompleteTaskUseCase(repository)
        this.deleteTaskUseCase = new DeleteTaskUseCase(repository)
    }

    async getAll(req: Request, res: Response) {
        try {
            const tasks = await this.getTaskUseCase.execute();
            res.json(tasks);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { title } = req.body;
            const task = await this.createTaskUseCase.execute(title);
            res.status(201).json(task);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async complete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const task = await this.completeTaskUseCase.execute(id);
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.deleteTaskUseCase.execute(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}
