import { Task } from "../../entities/task";
import { TaskRepository } from "../../repositories/task.repository";

export class CreateTaskUseCase{
    private repository: TaskRepository

    constructor(repository: TaskRepository){
        this.repository = repository
    }

    async execute(title: string, userId: number){
        const task = new Task(title, false, undefined, userId)
        return await this.repository.create(task)
    }
}