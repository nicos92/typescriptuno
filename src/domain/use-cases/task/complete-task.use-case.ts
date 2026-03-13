import { TaskRepository } from "../../repositories/task.repository";

export class CompleteTaskUseCase{
    private repository: TaskRepository

    constructor(repository: TaskRepository){
        this.repository = repository
    }

    async execute(id: number){
        const task = await this.repository.findById(id)

        if (!task){
            throw new Error('Tarea no encontrada')
        }

        task.complete()

        return await this.repository.update(task)
    }
}