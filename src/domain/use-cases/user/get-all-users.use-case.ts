import { User } from "../../entities/user";
import { UserRepository } from "../../repositories/user.repository";

export class GetAllUsersUseCase {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute() {
    return await this.repository.findAll();
  }
}
