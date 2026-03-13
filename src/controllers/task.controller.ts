import { Request, Response } from "express";
import { TaskRepository } from "../domain/repositories/task.repository";
import { GetTaskUseCase } from "../domain/use-cases/task/get-task.use-case";
import { CreateTaskUseCase } from "../domain/use-cases/task/create-task.use-case";
import { CompleteTaskUseCase } from "../domain/use-cases/task/complete-task.use-case";
import { DeleteTaskUseCase } from "../domain/use-cases/task/delete-task.use-case";
import { AuthRequest } from "../middleware/auth.middleware";

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

    async getAll(req: AuthRequest, res: Response) {
        try {
            const tasks = await this.getTaskUseCase.execute() as any[];
            res.json(tasks.map(task => ({
                id: task.getId(),
                title: task.getTitle(),
                completed: task.isCompleted(),
                userId: task.getUserId()
            })));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const task = await this.getTaskUseCase.execute(id) as any;
            res.json({
                id: task.getId(),
                title: task.getTitle(),
                completed: task.isCompleted(),
                userId: task.getUserId()
            });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async create(req: AuthRequest, res: Response) {
        try {
            const { title } = req.body;
            const userId = req.user!.id;
            const task = await this.createTaskUseCase.execute(title, userId);
            res.status(201).json({
                id: task.getId(),
                title: task.getTitle(),
                completed: task.isCompleted(),
                userId: task.getUserId()
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async complete(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const task = await this.completeTaskUseCase.execute(id);
            res.json({
                id: task.getId(),
                title: task.getTitle(),
                completed: task.isCompleted(),
                userId: task.getUserId()
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.deleteTaskUseCase.execute(id);
            res.json({ message: "Tarea eliminada" });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}
