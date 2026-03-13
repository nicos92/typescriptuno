import { TaskRepository } from "../../repositories/task.repository";

export class GetTaskUseCase {
    private repository: TaskRepository

    constructor(repository: TaskRepository){
        this.repository = repository
    }

    async execute(){
        return await this.repository.findAll()
    }
}