import { User } from "../../entities/user"
import { UserRepository } from "../../repositories/user.repository"
import { Role } from "../../../types/role"

export class CreateUserUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(username: string, password: string, rol: Role) {
    const existingUser = await this.repository.findByUsername(username)
    if (existingUser) {
      throw new Error("El usuario ya existe")
    }

    const newUser = new User(password, rol, username)
    return await this.repository.create(newUser)
  }
}
