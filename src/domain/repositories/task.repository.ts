import { Task } from "../entities/task";

export interface TaskRepository{
    findAll(): Promise<Task[]>
    findAllByUserId(userId: number): Promise<Task[]>
    findById(id: number): Promise<Task | null>
    create(task: Task): Promise<Task>
    update(task: Task): Promise<Task>
    softDelete(id: number): Promise<void>
}