import { User } from "../../entities/user";
import { UserRepository } from "../../repositories/user.repository";

export class GetUserUseCase {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute(id: number) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }
}
