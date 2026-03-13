import { Task } from "../../../domain/entities/task";
import { TaskRepository } from "../../../domain/repositories/task.repository";
import { AppDataSource } from "../config/data-source";
import { TaskSchema } from "../models/task.schema";

export class TypeORMTaskRepository implements TaskRepository{

    private repository = AppDataSource.getRepository(TaskSchema)

    async findAll(): Promise<Task[]> {
        const taskData = await this.repository.find()
        return taskData.map(data => this.mapToEntity(data))
    }
    
    async findById(id: number): Promise<Task | null> {
        const data = await this.repository.findOneBy({id})

        if (!data){
            return null
        }

        return this.mapToEntity(data)
    }

    async create(task: Task): Promise<Task> {
        const newTask = await this.repository.save({
            title: task.getTitle(),
            completed: task.isCompleted()
        })

        return this.mapToEntity(newTask)
    }

    async update(task: Task): Promise<Task> {
        const updateTask = await this.repository.save({
            id: task.getId(),
            title: task.getTitle(),
            completed: task.isCompleted()
        })

        return this.mapToEntity(updateTask)
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id)
    }

    private mapToEntity(data: TaskSchema): Task{
        return new Task(data.title, data.completed, data.id)
    }
}