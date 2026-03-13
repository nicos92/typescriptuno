export class Task {
  private id?: number;
  private title: string;
  private completed: boolean;

  constructor(title: string, completed: boolean, id?: number) {
    if (!title) {
      throw new Error("El título es obligatorio");
    }

    this.id = id;
    this.title = title;
    this.completed = completed;
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

  public complete() {
    if (this.completed) {
      throw new Error("La tarea ya está completada");
    }

    this.completed = true;
  }
}
