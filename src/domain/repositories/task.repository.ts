import { Task } from "../entities/task";

export interface TaskRepository{
    findAll(): Promise<Task[]>
    findById(id: number): Promise<Task | null>
    create(task: Task): Promise<Task>
    update(task: Task): Promise<Task>
    delete(id: number): Promise<void>
}