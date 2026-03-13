import { TaskRepository } from "../../repositories/task.repository";

export class GetTaskUseCase {
    private repository: TaskRepository

    constructor(repository: TaskRepository){
        this.repository = repository
    }

    async execute(id?: number){
        if (id) {
            const task = await this.repository.findById(id)
            if (!task) {
                throw new Error("Tarea no encontrada")
            }
            return task
        }
        return await this.repository.findAll()
    }
}
