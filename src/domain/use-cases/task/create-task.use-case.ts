import { Task } from "../../entities/task";
import { TaskRepository } from "../../repositories/task.repository";

export class CreateTaskUseCase{
    private repository: TaskRepository

    constructor(respository: TaskRepository){
        this.repository = respository
    }

    async execute(title: string){
        const task = new Task(title, false)
        return await this.repository.create(task)
    }
}