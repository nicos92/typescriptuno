export class Task {
  private id?: number;
  private title: string;
  private completed: boolean;
  private userId?: number;
  private deletedAt?: Date | null;

  constructor(
    title: string, 
    completed: boolean, 
    id?: number,
    userId?: number,
    deletedAt?: Date | null
  ) {
    if (!title) {
      throw new Error("El título es obligatorio");
    }

    this.id = id;
    this.title = title;
    this.completed = completed;
    this.userId = userId;
    this.deletedAt = deletedAt;
  }

  public getId() {
    return this.id;
  }

  public getTitle() {
    return this.title;
  }

  public isCompleted() {
    return this.completed;
  }

  public getUserId() {
    return this.userId;
  }

  public getDeletedAt() {
    return this.deletedAt;
  }

  public isDeleted() {
    return this.deletedAt !== null && this.deletedAt !== undefined;
  }

  public complete() {
    if (this.completed) {
      throw new Error("La tarea ya está completada");
    }

    this.completed = true;
  }
}
